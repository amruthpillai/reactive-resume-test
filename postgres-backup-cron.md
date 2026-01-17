# PostgreSQL Backup via Host Cron Job

This guide shows how to set up PostgreSQL backups using a cron job on your Docker Swarm host machine, rather than running a separate backup container.

## Benefits of Host Cron Approach

- **Simpler setup** - No additional Docker service needed
- **Less resource usage** - No always-running backup container
- **Easier debugging** - Standard cron logs and familiar tools
- **More flexible** - Direct access to host filesystem and tools
- **Better for multiple databases** - One cron job can backup multiple services

## Prerequisites

- Docker Swarm running with PostgreSQL service
- SSH/shell access to the Swarm manager node
- `postgresql-client` tools installed on host (or use Docker exec)

## Setup Methods

You can choose between two methods:

### Method 1: Using Host PostgreSQL Client Tools (Recommended)

Install PostgreSQL client on your host and connect directly to the container.

### Method 2: Using Docker Exec

No need to install anything on the host - use `docker exec` to run pg_dump inside the container.

---

## Method 1: Host PostgreSQL Client Tools

### Step 1: Install PostgreSQL Client

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql-client

# CentOS/RHEL
sudo yum install -y postgresql

# Alpine (if running on Alpine host)
sudo apk add postgresql-client
```

### Step 2: Create Backup Directory

```bash
sudo mkdir -p /var/backups/postgresql
sudo chown $USER:$USER /var/backups/postgresql
```

### Step 3: Create Backup Script

Create `/usr/local/bin/postgres-backup.sh`:

```bash
#!/bin/bash
set -e

# Configuration - fill in your values
BACKUP_DIR="/var/backups/postgresql"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${BACKUP_DIR}/backup.log"

# Database credentials - set as literal strings
POSTGRES_HOST="localhost"
POSTGRES_USER="myuser"
POSTGRES_DB="mydb"
POSTGRES_PASSWORD="mypassword"

log() {
    echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $1" | tee -a "$LOG_FILE"
}

log "Starting backup of ${POSTGRES_DB}..."

# Create backup filename
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

# Perform backup using host's pg_dump
export PGPASSWORD="$POSTGRES_PASSWORD"
pg_dump -h "$POSTGRES_HOST" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        | gzip > "${BACKUP_FILE}"
unset PGPASSWORD

# Verify backup was created
if [ -f "${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    log "Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})"
    
    # Create a "latest" symlink
    ln -sf "$(basename ${BACKUP_FILE})" "${BACKUP_DIR}/latest.sql.gz"
    
    # Write status files
    echo "SUCCESS" > "${BACKUP_DIR}/.backup_status"
    date +%s > "${BACKUP_DIR}/.backup_timestamp"
else
    log "ERROR: Backup file was not created!"
    echo "FAILED" > "${BACKUP_DIR}/.backup_status"
    exit 1
fi

# Clean up old backups
log "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# Count remaining backups
BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "*.sql.gz" -type f | wc -l)
log "Current backup count: ${BACKUP_COUNT}"

# List recent backups
log "Recent backups:"
ls -lh "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | tail -5 | tee -a "$LOG_FILE"

log "Backup process completed successfully"

exit 0
```

### Step 4: Make Script Executable

```bash
sudo chmod +x /usr/local/bin/postgres-backup.sh
```

### Step 5: Test the Script

```bash
# Test run
sudo /usr/local/bin/postgres-backup.sh

# Check backup was created
ls -lh /var/backups/postgresql/
```

### Step 6: Set Up Cron Job

```bash
# Edit crontab for root user
sudo crontab -e

# Add the following line (backup daily at 2 AM)
0 2 * * * /usr/local/bin/postgres-backup.sh >> /var/backups/postgresql/cron.log 2>&1

# Or run every 6 hours
0 */6 * * * /usr/local/bin/postgres-backup.sh >> /var/backups/postgresql/cron.log 2>&1

# Or run every hour
0 * * * * /usr/local/bin/postgres-backup.sh >> /var/backups/postgresql/cron.log 2>&1
```

---

## Method 2: Pure Docker Exec (No Host Tools)

### Step 1: Create Backup Script

Create `/usr/local/bin/postgres-backup-docker.sh`:

```bash
#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/var/backups/postgresql"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${BACKUP_DIR}/backup.log"

# Docker configuration
POSTGRES_SERVICE="myapp_postgres"  # Your stack_service format
POSTGRES_USER="${POSTGRES_USER:-myuser}"
POSTGRES_DB="${POSTGRES_DB:-mydb}"

log() {
    echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $1" | tee -a "$LOG_FILE"
}

# Create backup directory
mkdir -p "${BACKUP_DIR}"

log "Starting backup of ${POSTGRES_DB}..."

# Get running postgres container
CONTAINER_ID=$(docker ps -q -f name=${POSTGRES_SERVICE} | head -1)

if [ -z "$CONTAINER_ID" ]; then
    log "ERROR: PostgreSQL container not found!"
    exit 1
fi

# Create backup filename
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql.gz"

# Execute pg_dump inside container and save to host
log "Running pg_dump in container ${CONTAINER_ID}..."
docker exec "$CONTAINER_ID" sh -c \
    "PGPASSWORD=\$(cat /run/secrets/postgres_password 2>/dev/null || echo \$POSTGRES_PASSWORD) \
     pg_dump -U ${POSTGRES_USER} -d ${POSTGRES_DB} \
     --no-owner --no-acl --clean --if-exists" \
    | gzip > "${BACKUP_FILE}"

# Verify backup
if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    log "Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})"
    
    # Create latest symlink
    ln -sf "$(basename ${BACKUP_FILE})" "${BACKUP_DIR}/latest.sql.gz"
    
    # Status files
    echo "SUCCESS" > "${BACKUP_DIR}/.backup_status"
    date +%s > "${BACKUP_DIR}/.backup_timestamp"
else
    log "ERROR: Backup file is empty or was not created!"
    echo "FAILED" > "${BACKUP_DIR}/.backup_status"
    exit 1
fi

# Cleanup old backups
log "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# Summary
BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "*.sql.gz" -type f | wc -l)
log "Backup count: ${BACKUP_COUNT}"
log "Backup process completed"

exit 0
```

### Step 2: Make Executable and Test

```bash
sudo chmod +x /usr/local/bin/postgres-backup-docker.sh
sudo /usr/local/bin/postgres-backup-docker.sh
```

### Step 3: Add to Crontab

```bash
sudo crontab -e

# Add this line
0 2 * * * /usr/local/bin/postgres-backup-docker.sh >> /var/backups/postgresql/cron.log 2>&1
```

---

## Environment Variables Setup

### Option 1: System Environment

Add to `/etc/environment` or `/etc/profile.d/postgres-backup.sh`:

```bash
export POSTGRES_USER="myuser"
export POSTGRES_DB="mydb"
export POSTGRES_PASSWORD="your_password"  # Or read from secret
```

### Option 2: Cron Environment

Set variables directly in crontab:

```bash
sudo crontab -e

# Add at the top
POSTGRES_USER=myuser
POSTGRES_DB=mydb
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Then add your cron job
0 2 * * * /usr/local/bin/postgres-backup.sh >> /var/backups/postgresql/cron.log 2>&1
```

### Option 3: Read from Docker Secret

The scripts above already include logic to read from Docker secrets using `docker exec`.

---

## Restore Procedures

### Restore from Host Cron Backup

```bash
# Method 1: If you have psql on host
BACKUP_FILE="/var/backups/postgresql/latest.sql.gz"
CONTAINER_ID=$(docker ps -q -f name=postgres | head -1)

# Get password
PGPASSWORD=$(docker exec $CONTAINER_ID cat /run/secrets/postgres_password)

# Get container IP
POSTGRES_HOST=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER_ID | head -1)

# Restore
gunzip -c "$BACKUP_FILE" | PGPASSWORD="$PGPASSWORD" psql -h "$POSTGRES_HOST" -U myuser -d mydb
```

```bash
# Method 2: Using docker exec (works with overlay networks)
BACKUP_FILE="/var/backups/postgresql/latest.sql.gz"
CONTAINER_ID=$(docker ps -q -f name=postgres | head -1)

# Copy backup into container
docker cp "$BACKUP_FILE" $CONTAINER_ID:/tmp/restore.sql.gz

# Restore inside container
docker exec -it $CONTAINER_ID sh -c \
    "PGPASSWORD=\$(cat /run/secrets/postgres_password) \
     gunzip -c /tmp/restore.sql.gz | psql -U myuser -d mydb"

# Cleanup
docker exec $CONTAINER_ID rm /tmp/restore.sql.gz
```

---

## Monitoring Cron Backups

### Check Cron Logs

```bash
# View cron execution log
tail -f /var/backups/postgresql/cron.log

# View backup script log
tail -f /var/backups/postgresql/backup.log

# Check system cron log
sudo tail -f /var/log/cron  # CentOS/RHEL
sudo tail -f /var/log/syslog | grep CRON  # Ubuntu/Debian
```

### Check Last Backup Status

```bash
# Check when last backup ran
if [ -f /var/backups/postgresql/.backup_timestamp ]; then
    echo "Last backup: $(date -d @$(cat /var/backups/postgresql/.backup_timestamp))"
    echo "Status: $(cat /var/backups/postgresql/.backup_status)"
else
    echo "No backup found"
fi

# List recent backups
ls -lht /var/backups/postgresql/*.sql.gz | head -5
```

### Create Monitoring Script

Create `/usr/local/bin/check-backup-health.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/postgresql"
MAX_AGE_HOURS=26

if [ ! -f "${BACKUP_DIR}/.backup_timestamp" ]; then
    echo "ERROR: No backup found!"
    exit 1
fi

LAST_BACKUP=$(cat "${BACKUP_DIR}/.backup_timestamp")
NOW=$(date +%s)
AGE_HOURS=$(( (NOW - LAST_BACKUP) / 3600 ))

if [ $AGE_HOURS -gt $MAX_AGE_HOURS ]; then
    echo "ERROR: Last backup is ${AGE_HOURS} hours old (max: ${MAX_AGE_HOURS})"
    exit 1
fi

STATUS=$(cat "${BACKUP_DIR}/.backup_status")
if [ "$STATUS" != "SUCCESS" ]; then
    echo "ERROR: Last backup status: ${STATUS}"
    exit 1
fi

echo "OK: Backup is current (${AGE_HOURS} hours old)"
exit 0
```

Add monitoring to cron (check every hour):

```bash
sudo crontab -e

# Add monitoring check
0 * * * * /usr/local/bin/check-backup-health.sh || echo "BACKUP ALERT: $(cat /var/backups/postgresql/.backup_status)" | mail -s "Backup Failed" admin@example.com
```

---

## Off-Site Backup with Cron

### Using rsync

```bash
# Add to backup script or separate cron job
# Sync to remote server
rsync -avz --delete \
    /var/backups/postgresql/ \
    backup-server:/backups/postgres/

# Or use SSH
rsync -avz -e "ssh -i /root/.ssh/backup_key" \
    /var/backups/postgresql/ \
    user@backup-server:/backups/postgres/
```

### Using rclone (to Cloud Storage)

```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Configure rclone (run once)
rclone config

# Add to crontab
0 3 * * * rclone sync /var/backups/postgresql/ remote:postgres-backups --exclude '.backup_*'
```

### Using AWS S3

```bash
# Install AWS CLI
sudo apt-get install awscli

# Configure AWS credentials
aws configure

# Add to backup script
aws s3 sync /var/backups/postgresql/ s3://your-bucket/postgres-backups/ \
    --exclude '.backup_*' \
    --storage-class STANDARD_IA
```

---

## Multiple Databases

Backup multiple PostgreSQL instances:

```bash
#!/bin/bash

# Database configurations
declare -A DATABASES=(
    ["app1"]="app1_postgres mydb1"
    ["app2"]="app2_postgres mydb2"
    ["app3"]="app3_postgres mydb3"
)

for app in "${!DATABASES[@]}"; do
    read service database <<< "${DATABASES[$app]}"
    
    CONTAINER_ID=$(docker ps -q -f name=${service} | head -1)
    BACKUP_FILE="/var/backups/postgresql/${app}_$(date +%Y%m%d_%H%M%S).sql.gz"
    
    echo "Backing up ${app} (${database})..."
    
    docker exec "$CONTAINER_ID" sh -c \
        "PGPASSWORD=\$(cat /run/secrets/postgres_password) \
         pg_dump -U postgres -d ${database} \
         --no-owner --no-acl --clean --if-exists" \
        | gzip > "${BACKUP_FILE}"
    
    echo "Created: ${BACKUP_FILE}"
done
```

---

## Advantages vs Disadvantages

### Host Cron Advantages ✅
- Simpler setup and debugging
- No extra Docker resources
- Easier to monitor (standard cron logs)
- More flexible (can backup multiple services)
- Direct access to host filesystem
- Can integrate with existing backup systems

### Host Cron Disadvantages ❌
- Requires host access
- May need to install PostgreSQL client
- Cron logs can be harder to centralize
- Not as "containerized" / cloud-native

### Container-Based Advantages ✅
- Fully containerized solution
- No host dependencies
- Scales with Swarm
- Easier to version control (in docker-compose)

### Container-Based Disadvantages ❌
- More complex setup
- Uses Docker resources continuously
- Harder to debug
- Logs require Docker commands to access

---

## Best Practices

1. **Test restores regularly** - Schedule monthly test restores
2. **Monitor backup age** - Alert if backups are old
3. **Keep logs** - Retain backup logs for troubleshooting
4. **Rotate backups** - Don't let backups fill your disk
5. **Off-site copies** - Always maintain off-site backups
6. **Document procedures** - Keep restore procedures documented
7. **Use compression** - gzip saves significant space
8. **Lock critical operations** - Prevent concurrent backups

---

## Troubleshooting

### Cron Job Not Running

```bash
# Check cron is running
sudo systemctl status cron  # Ubuntu/Debian
sudo systemctl status crond  # CentOS/RHEL

# Check cron logs
sudo tail -f /var/log/syslog | grep CRON

# Verify crontab syntax
sudo crontab -l
```

### Permission Denied

```bash
# Fix backup directory permissions
sudo chown -R $USER:$USER /var/backups/postgresql
sudo chmod 755 /var/backups/postgresql
```

### Container Not Found

```bash
# List running containers
docker ps -f name=postgres

# Check service name
docker service ls

# Update POSTGRES_SERVICE variable in script
```

### Backup File Empty

```bash
# Check if password is correct
docker exec $(docker ps -q -f name=postgres) \
    sh -c 'PGPASSWORD=$(cat /run/secrets/postgres_password) psql -U myuser -d mydb -c "\dt"'

# Check database exists
docker exec $(docker ps -q -f name=postgres) \
    sh -c 'psql -U myuser -l'
```

---

## Summary

The host cron method is excellent for:
- Simple setups
- Multiple database instances
- Integration with existing backup infrastructure
- When you need direct filesystem access

Choose this method if you prefer traditional Unix tools and workflows.
