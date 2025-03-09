// src/data/challenges.ts
export interface Challenge {
	id: number;
	title: string;
	description: string;
	testString: string;
	solution: string;
	hint: string;
}

export const challenges: Challenge[] = [
	{
		id: 1,
		title: "Match All Digits",
		description: "Write a pattern that matches all digits in the test string.",
		testString: "The price is $42.99 for item #12345.",
		solution: "[0-9]",
		hint: "Use a character class for digits.",
	},
	{
		id: 2,
		title: "Match Email Addresses",
		description: "Create a pattern that matches valid email addresses.",
		testString: "Contact us at support@example.com or info@company.org.",
		solution: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
		hint: "Break it down: username @ domain . TLD",
	},
	{
		id: 3,
		title: "Match HTML Tags",
		description: "Write a pattern that matches HTML tags.",
		testString: "<div>This is a <b>bold</b> statement in a <p>paragraph</p>.</div>",
		solution: "<[^>]+>",
		hint: "Look for text between < and >",
	},
	{
		id: 4,
		title: "Match URLs",
		description: "Create a pattern that matches URLs in the text.",
		testString: "Visit our website at https://www.example.com or http://subdomain.example.org/page.",
		solution: "https?://[\\w.-]+\\.[\\w]{2,}(?:/[\\w./-]*)?",
		hint: "Consider http vs https and the domain structure",
	},
	{
		id: 5,
		title: "Extract Quoted Text",
		description: "Write a pattern that extracts text between double quotes.",
		testString: 'She said "hello" and he replied "goodbye".',
		solution: '"([^"]*)"',
		hint: "Use a capturing group between quote marks",
	},
];
