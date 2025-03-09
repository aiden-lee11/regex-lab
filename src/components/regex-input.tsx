// src/components/regex-input.tsx
import React from "react";
import { Input } from "@/components/ui/input";

interface RegexInputProps {
	pattern: string;
	flags: string;
	onChange: (value: string) => void;
}

const RegexInput: React.FC<RegexInputProps> = ({ pattern, flags, onChange }) => {
	return (
		<div className="flex">
			<div className="flex-none py-2 px-3 bg-muted rounded-l-md border-y border-l border-input">/</div>
			<Input
				type="text"
				value={pattern}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Enter your regex pattern"
				className="flex-grow rounded-none border-y"
			/>
			<div className="flex-none py-2 px-3 bg-muted rounded-r-md border-y border-r border-input">{`/${flags}`}</div>
		</div>
	);
};

export default RegexInput;
