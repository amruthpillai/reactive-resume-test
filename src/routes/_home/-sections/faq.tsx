import { Trans } from "@lingui/react/macro";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/animate-ui/accordion";
import { cn } from "@/utils/style";

type FAQItem = {
	question: string;
	answer: React.ReactNode;
};

const faqItems: FAQItem[] = [
	{
		question: "Nisi do quis adipisicing laboris ut nostrud?",
		answer:
			"Nisi ea voluptate ea consectetur nostrud exercitation duis nostrud ad ut officia dolore culpa. Nisi esse tempor ullamco magna nostrud culpa. Do cupidatat do aliquip do. Ex sit ut ullamco magna fugiat eiusmod sint voluptate sunt eu ut. Magna exercitation elit tempor. Lorem sint exercitation in fugiat anim adipisicing pariatur. Pariatur aliquip pariatur cupidatat deserunt et non cillum Lorem sit. Laborum officia tempor velit laborum officia Lorem eu dolor aute. Et cupidatat quis deserunt esse pariatur et. Id consectetur deserunt amet ad ipsum irure cupidatat amet Lorem pariatur aliquip velit nostrud. Lorem culpa eu velit id minim quis velit Lorem ex nisi officia reprehenderit quis incididunt.",
	},
	{
		question: "Consectetur enim cupidatat fugiat non est dolore amet?",
		answer:
			"Nisi ea voluptate ea consectetur nostrud exercitation duis nostrud ad ut officia dolore culpa. Nisi esse tempor ullamco magna nostrud culpa. Do cupidatat do aliquip do. Ex sit ut ullamco magna fugiat eiusmod sint voluptate sunt eu ut. Magna exercitation elit tempor. Lorem sint exercitation in fugiat anim adipisicing pariatur. Pariatur aliquip pariatur cupidatat deserunt et non cillum Lorem sit. Laborum officia tempor velit laborum officia Lorem eu dolor aute. Et cupidatat quis deserunt esse pariatur et. Id consectetur deserunt amet ad ipsum irure cupidatat amet Lorem pariatur aliquip velit nostrud. Lorem culpa eu velit id minim quis velit Lorem ex nisi officia reprehenderit quis incididunt.",
	},
	{
		question: "Ullamco sit voluptate deserunt incididunt?",
		answer:
			"Nisi ea voluptate ea consectetur nostrud exercitation duis nostrud ad ut officia dolore culpa. Nisi esse tempor ullamco magna nostrud culpa. Do cupidatat do aliquip do. Ex sit ut ullamco magna fugiat eiusmod sint voluptate sunt eu ut. Magna exercitation elit tempor. Lorem sint exercitation in fugiat anim adipisicing pariatur. Pariatur aliquip pariatur cupidatat deserunt et non cillum Lorem sit. Laborum officia tempor velit laborum officia Lorem eu dolor aute. Et cupidatat quis deserunt esse pariatur et. Id consectetur deserunt amet ad ipsum irure cupidatat amet Lorem pariatur aliquip velit nostrud. Lorem culpa eu velit id minim quis velit Lorem ex nisi officia reprehenderit quis incididunt.",
	},
	{
		question: "Nisi nisi eu exercitation pariatur do nulla reprehenderit sint quis pariatur?",
		answer:
			"Nisi ea voluptate ea consectetur nostrud exercitation duis nostrud ad ut officia dolore culpa. Nisi esse tempor ullamco magna nostrud culpa. Do cupidatat do aliquip do. Ex sit ut ullamco magna fugiat eiusmod sint voluptate sunt eu ut. Magna exercitation elit tempor. Lorem sint exercitation in fugiat anim adipisicing pariatur. Pariatur aliquip pariatur cupidatat deserunt et non cillum Lorem sit. Laborum officia tempor velit laborum officia Lorem eu dolor aute. Et cupidatat quis deserunt esse pariatur et. Id consectetur deserunt amet ad ipsum irure cupidatat amet Lorem pariatur aliquip velit nostrud. Lorem culpa eu velit id minim quis velit Lorem ex nisi officia reprehenderit quis incididunt.",
	},
	{
		question: "Voluptate id labore fugiat proident et est?",
		answer:
			"Nisi ea voluptate ea consectetur nostrud exercitation duis nostrud ad ut officia dolore culpa. Nisi esse tempor ullamco magna nostrud culpa. Do cupidatat do aliquip do. Ex sit ut ullamco magna fugiat eiusmod sint voluptate sunt eu ut. Magna exercitation elit tempor. Lorem sint exercitation in fugiat anim adipisicing pariatur. Pariatur aliquip pariatur cupidatat deserunt et non cillum Lorem sit. Laborum officia tempor velit laborum officia Lorem eu dolor aute. Et cupidatat quis deserunt esse pariatur et. Id consectetur deserunt amet ad ipsum irure cupidatat amet Lorem pariatur aliquip velit nostrud. Lorem culpa eu velit id minim quis velit Lorem ex nisi officia reprehenderit quis incididunt.",
	},
	{
		question: "Magna sit esse aliquip duis cupidatat elit Quis magna reprehenderit exercitation?",
		answer:
			"Nisi ea voluptate ea consectetur nostrud exercitation duis nostrud ad ut officia dolore culpa. Nisi esse tempor ullamco magna nostrud culpa. Do cupidatat do aliquip do. Ex sit ut ullamco magna fugiat eiusmod sint voluptate sunt eu ut. Magna exercitation elit tempor. Lorem sint exercitation in fugiat anim adipisicing pariatur. Pariatur aliquip pariatur cupidatat deserunt et non cillum Lorem sit. Laborum officia tempor velit laborum officia Lorem eu dolor aute. Et cupidatat quis deserunt esse pariatur et. Id consectetur deserunt amet ad ipsum irure cupidatat amet Lorem pariatur aliquip velit nostrud. Lorem culpa eu velit id minim quis velit Lorem ex nisi officia reprehenderit quis incididunt.",
	},
];

export function FAQ() {
	return (
		<section id="frequently-asked-questions" className="flex flex-col gap-x-32 gap-y-4 p-4 md:flex-row md:p-8">
			<h2
				className={cn(
					"font-semibold text-2xl tracking-tight md:text-4xl xl:text-5xl",
					"flex flex-wrap items-center gap-x-1.5 md:flex-col md:items-start",
				)}
			>
				<Trans context="Every word needs to be wrapped in a tag">
					<span>Frequently</span>
					<span>Asked</span>
					<span>Questions</span>
				</Trans>
			</h2>

			<div className="max-w-2xl flex-1 md:ml-auto 2xl:max-w-4xl">
				<Accordion type="multiple">
					{faqItems.map((item) => (
						<FAQItem key={item.question} item={item} />
					))}
				</Accordion>
			</div>
		</section>
	);
}

type FAQItemProps = {
	item: FAQItem;
};

function FAQItem({ item }: FAQItemProps) {
	return (
		<AccordionItem value={item.question}>
			<AccordionTrigger>
				{item.question}
				<CaretRightIcon />
			</AccordionTrigger>
			<AccordionContent>{item.answer}</AccordionContent>
		</AccordionItem>
	);
}
