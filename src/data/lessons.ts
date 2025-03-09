// src/data/lessons.ts
export interface LessonExample {
	pattern: string;
	testString: string;
	explanation: string;
}

export interface Lesson {
	title: string;
	content: string;
	examples: LessonExample[];
}

export const lessons: Lesson[] = [
	{
		title: "Introduction to Regular Expressions",
		content:
			"Regular expressions (regex) are patterns used to match character combinations in strings. They are incredibly powerful for text processing and validation.",
		examples: [
			{ pattern: "hello", testString: "hello world", explanation: 'Matches the literal text "hello"' },
			{ pattern: "a|b", testString: "abc", explanation: 'Matches either "a" or "b"' },
		],
	},
	{
		title: "Basic Patterns",
		content:
			"The simplest patterns match literal text. For example, the pattern 'hello' will match the string 'hello'.",
		examples: [
			{ pattern: "cat", testString: "The cat sat on the mat.", explanation: 'Matches the literal word "cat"' },
			{ pattern: "dog|cat", testString: "I have a dog and a cat.", explanation: 'Matches either "dog" or "cat"' },
		],
	},
	{
		title: "Character Classes",
		content: "Character classes match any one character from a set of characters.",
		examples: [
			{ pattern: "[aeiou]", testString: "apple", explanation: "Matches any vowel" },
			{ pattern: "[0-9]", testString: "The code is 1234", explanation: "Matches any digit" },
		],
	},
	{
		title: "Quantifiers",
		content: "Quantifiers specify how many instances of a character or group must be present.",
		examples: [
			{ pattern: "a+", testString: "aaa apple banana", explanation: 'Matches one or more "a" characters' },
			{
				pattern: "go*d",
				testString: "gd god goood",
				explanation: 'Matches "g" followed by zero or more "o" characters, followed by "d"',
			},
		],
	},
	{
		title: "Anchors",
		content: "Anchors match positions rather than characters.",
		examples: [
			{
				pattern: "^start",
				testString: "start of line\nnot at start",
				explanation: 'Matches "start" only at the beginning of a line',
			},
			{ pattern: "end$", testString: "at the end\nend", explanation: 'Matches "end" only at the end of a line' },
		],
	},
	{
		title: "Groups and Capturing",
		content:
			"Groups allow you to apply quantifiers to entire patterns. They also capture the matched text for later use.",
		examples: [
			{ pattern: "(ab)+", testString: "ababab", explanation: 'Matches one or more occurrences of the sequence "ab"' },
			{
				pattern: "(\\w+)@(\\w+)\\.com",
				testString: "contact@example.com",
				explanation: "Captures username and domain in an email address",
			},
		],
	},
	{
		title: "Lookahead and Lookbehind",
		content:
			"Lookahead and lookbehind assertions match text based on what follows or precedes it, without including that text in the match.",
		examples: [
			{ pattern: "foo(?=bar)", testString: "foobar", explanation: 'Matches "foo" only if followed by "bar"' },
			{
				pattern: "(?<=\\$)\\d+",
				testString: "Price: $25",
				explanation: 'Matches digits only if preceded by a "$" sign',
			},
		],
	},
];
