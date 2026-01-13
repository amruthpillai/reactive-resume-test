- Implement a donation banner on the landing page that encourages users to support the project via Open Collective and GitHub Sponsors. The banner should explain that contributions help sustain the project's long-term viability, enable ongoing maintenance, and make it possible to bring additional contributors on board, lessening the burden of maintenance from a single individual.

- Design and implement a comprehensive migration script to transfer all existing users, their credentials (including passwords, if present), and their resumes into the updated database schema.

  Step 1 (Password Handling):
  For each user, if a password exists, migrate it to a new column named `oldPassword` (this should contain the original `bcrypt` password hash). On user login, if the `oldPassword` column is present, verify the user's entered password against this `bcrypt` hash. If authentication succeeds, re-hash the entered password using `argon2id` (the current password hashing standard) and save it in the `password` column, then remove the `oldPassword` from the user's record. This ensures all users seamlessly transition from the old to the new password hashing method on their next login.

  Step 2 (Resume Migration):
  Develop a script to convert resume data from the legacy Reactive Resume JSON format into the new JSON Schema format. Store each migrated resume along with its associated user ID in the new database. Additionally, ensure that resume-related statistics (such as view and download counts) are correctly migrated and preserved.