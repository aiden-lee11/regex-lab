// src/data/commonPatterns.ts
export interface Pattern {
	name: string;
	pattern: string;
}

export const commonPatterns: Pattern[] = [
	{ name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
	{ name: "URL", pattern: "https?://[\\w.-]+\\.[\\w]{2,}(?:/[\\w./-]*)?" },
	{ name: "Phone Number (US)", pattern: "^(\\+0?1\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$" },
	{ name: "Date (MM/DD/YYYY)", pattern: "\\d{1,2}/\\d{1,2}/\\d{4}" },
	{ name: "IP Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
	{ name: "HTML Tag", pattern: "<[^>]+>" },
	{ name: "Password Strength", pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$" },
];
