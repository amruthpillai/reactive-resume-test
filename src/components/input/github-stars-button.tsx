import { GithubLogoIcon, StarIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/integrations/orpc/client";
import { CountUp } from "../animation/count-up";
import { Button } from "../ui/button";

export function GithubStarsButton() {
	const { data: starCount } = useQuery(orpc.statistics.github.getStarCount.queryOptions());

	return (
		<Button asChild variant="outline">
			<a href="https://github.com/AmruthPillai/Reactive-Resume" target="_blank" rel="noopener noreferrer">
				<GithubLogoIcon />
				{starCount && <CountUp to={starCount} duration={0.5} separator="," className="font-bold" />}
				<StarIcon />
			</a>
		</Button>
	);
}
