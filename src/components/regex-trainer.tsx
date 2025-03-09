// src/components/RegexTrainer.tsx
"use client"

import React, { useState, useEffect } from "react";
import RegexInput from "./regex-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Code, BookOpen, Dumbbell, Lightbulb, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { lessons } from "@/data/lessons";
import { challenges } from "@/data/challenges";
import { commonPatterns } from "@/data/commonPatterns";

interface Match {
	text: string;
	index: number;
	groups: string[];
}

interface Results {
	matches: Match[];
	test: boolean;
}

const RegexTrainer = () => {
	const [pattern, setPattern] = useState("");
	const [flags, setFlags] = useState("g");
	const [testString, setTestString] = useState("");
	const [results, setResults] = useState<Results | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
	const [currentLesson, setCurrentLesson] = useState(0);
	const [showExplanation, setShowExplanation] = useState(false);
	const [currentTab, setCurrentTab] = useState("learn"); // "learn", "practice", "playground"

	// Update regex results whenever pattern, flags, or testString changes.
	useEffect(() => {
		if (pattern.trim() === "") {
			setResults(null);
			setError(null);
			return;
		}

		try {
			const regex = new RegExp(pattern, flags);
			const matches: Match[] = [];
			const MAX_MATCHES = 50;

			// Use matchAll for better handling
			if (flags.includes("g")) {
				const matchAll = [...testString.matchAll(regex)].slice(0, MAX_MATCHES);
				console.log(matchAll);
				matchAll.forEach((match) => {
					matches.push({
						text: match[0],
						index: match.index!,
						groups: match.slice(1),
					});
				});
			} else {
				const match = regex.exec(testString);
				if (match) {
					matches.push({
						text: match[0],
						index: match.index,
						groups: match.slice(1),
					});
				}
			}

			setResults({
				matches,
				test: matches.length > 0,
			});
			setError(null);
		} catch (err: any) {
			setError(err.message);
			setResults(null);
		}
	}, [pattern, flags, testString]);

	// Highlight matched text within the test string.
	const highlightMatches = () => {
		if (!results || !results.matches.length) {
			return testString;
		}

		// Sort matches by their starting index.
		const sortedMatches = [...results.matches].sort((a, b) => a.index - b.index);
		const parts: React.ReactNode[] = [];
		let lastIndex = 0;

		sortedMatches.forEach((match, idx) => {
			if (match.index > lastIndex) {
				parts.push(
					<span key={`text-${idx}`}>
						{testString.substring(lastIndex, match.index)}
					</span>
				);
			}
			parts.push(
				<span key={`match-${idx}`} className="bg-yellow-300 dark:bg-yellow-800 rounded px-0.5">
					{match.text}
				</span>
			);
			lastIndex = match.index + match.text.length;
		});

		if (lastIndex < testString.length) {
			parts.push(<span key="text-last">{testString.substring(lastIndex)}</span>);
		}

		return parts;
	};

	// Handle challenge selection.
	const selectChallenge = (challenge: any) => {
		setSelectedChallenge(challenge);
		setPattern("");
		setTestString(challenge.testString);
	};

	// Load a lesson example.
	const loadExample = (example: { pattern: string; testString: string }) => {
		setPattern(example.pattern);
		setTestString(example.testString);
	};

	// Apply a common pattern from the reference list.
	const applyCommonPattern = (patternObj: { name: string; pattern: string }) => {
		setPattern(patternObj.pattern);
	};

	// Inline flag selector.
	const FlagSelector = () => (
		<div className="flex flex-wrap gap-4">
			{["g", "i", "m", "s", "u", "y"].map((flag) => (
				<div key={flag} className="flex items-center space-x-2">
					<Checkbox
						id={`flag-${flag}`}
						checked={flags.includes(flag)}
						onCheckedChange={(checked) => {
							if (checked) {
								setFlags(flags + flag);
							} else {
								setFlags(flags.replace(flag, ""));
							}
						}}
					/>
					<label htmlFor={`flag-${flag}`} className="text-sm font-medium leading-none">
						{flag}
					</label>
				</div>
			))}
		</div>
	);

	return (
		<div className="container mx-auto p-4 max-w-6xl">
			<div className="space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Interactive Regex Trainer</h1>
					<p className="text-muted-foreground">
						Learn, practice, and master regular expressions
					</p>
				</div>
				<Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="learn" className="flex items-center gap-2">
							<BookOpen className="h-4 w-4" />
							<span>Learn</span>
						</TabsTrigger>
						<TabsTrigger value="practice" className="flex items-center gap-2">
							<Dumbbell className="h-4 w-4" />
							<span>Practice</span>
						</TabsTrigger>
						<TabsTrigger value="playground" className="flex items-center gap-2">
							<Code className="h-4 w-4" />
							<span>Playground</span>
						</TabsTrigger>
					</TabsList>

					{/* Learn Tab */}
					<TabsContent value="learn">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div className="space-y-1">
									<CardTitle>{lessons[currentLesson].title}</CardTitle>
									<CardDescription>
										Lesson {currentLesson + 1} of {lessons.length}
									</CardDescription>
								</div>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
										disabled={currentLesson === 0}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() =>
											setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))
										}
										disabled={currentLesson === lessons.length - 1}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<p className="mb-4">{lessons[currentLesson].content}</p>
									<h3 className="font-semibold mb-3">Examples:</h3>
									<div className="space-y-3">
										{lessons[currentLesson].examples.map((example, idx) => (
											<Card key={idx} className="overflow-hidden">
												<CardHeader className="py-3">
													<div className="flex justify-between items-center">
														<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
															/{example.pattern}/
														</code>
														<Button variant="secondary" size="sm" onClick={() => loadExample(example)}>
															Try it
														</Button>
													</div>
												</CardHeader>
												<CardContent className="py-3 border-t">
													<div className="text-sm mb-2">
														<span className="font-medium">Test string:</span>
														<code className="ml-2 text-xs">{example.testString}</code>
													</div>
													<div className="text-sm text-muted-foreground">
														{example.explanation}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</div>
								<div className="pt-4 border-t">
									<h3 className="font-semibold mb-3">Practice what you've learned:</h3>
									<div className="space-y-4">
										<div>
											<label className="block mb-2 text-sm font-medium">
												Regular Expression:
											</label>
											<RegexInput pattern={pattern} flags={flags} onChange={setPattern} />
											{error && <p className="text-destructive text-sm mt-1">{error}</p>}
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium">Flags:</label>
											<FlagSelector />
											<p className="text-xs text-muted-foreground mt-2">
												g: global, i: case-insensitive, m: multiline, s: dot matches newlines, u:
												unicode, y: sticky
											</p>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium">Test String:</label>
											<Textarea
												value={testString}
												onChange={(e) => setTestString(e.target.value)}
												placeholder="Enter text to test your regex against"
												className="min-h-[100px]"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium">Results:</label>
											<div className="border rounded-md p-4 bg-muted/30 min-h-[100px]">
												{results ? (
													<div className="space-y-3">
														<div className="flex items-center">
															{results.test ? (
																<Badge
																	variant="outline"
																	className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
																>
																	<Check className="mr-1 h-3 w-3" /> Pattern matches
																</Badge>
															) : (
																<Badge
																	variant="outline"
																	className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
																>
																	<X className="mr-1 h-3 w-3" /> Pattern does not match
																</Badge>
															)}
														</div>
														{results.matches.length > 0 && (
															<div className="space-y-2">
																<p className="text-sm font-medium">
																	Matches ({results.matches.length}):
																</p>
																<div className="font-mono text-sm whitespace-pre-wrap break-all p-3 bg-muted rounded-md">
																	{highlightMatches()}
																</div>
																{results.matches.some((match) => match.groups.length > 0) && (
																	<div className="mt-4">
																		<p className="text-sm font-medium">Capturing Groups:</p>
																		<ul className="list-disc ml-5 text-sm space-y-1 mt-2">
																			{results.matches.map((match, idx) =>
																				match.groups.length > 0 ? (
																					<li key={idx}>
																						Match {idx + 1}:{" "}
																						{match.groups.map((g, i) => (
																							<span key={i} className="text-primary">{`Group ${i + 1
																								}: "${g}" `}</span>
																						))}
																					</li>
																				) : null
																			)}
																		</ul>
																	</div>
																)}
															</div>
														)}
													</div>
												) : (
													<p className="text-muted-foreground">
														Enter a pattern to see results
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Practice Tab */}
					<TabsContent value="practice">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="md:col-span-1">
								<CardHeader>
									<CardTitle>Challenges</CardTitle>
									<CardDescription>Test your regex skills</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									{challenges.map((challenge) => (
										<div
											key={challenge.id}
											className={cn(
												"p-3 rounded-md cursor-pointer transition-colors",
												selectedChallenge?.id === challenge.id
													? "bg-primary/10 border-l-4 border-primary"
													: "bg-muted/50 hover:bg-muted border-l-4 border-transparent"
											)}
											onClick={() => selectChallenge(challenge)}
										>
											<h3 className="font-medium">{challenge.title}</h3>
											<p className="text-sm text-muted-foreground truncate">
												{challenge.description}
											</p>
										</div>
									))}
								</CardContent>
							</Card>
							<Card className="md:col-span-2">
								{selectedChallenge ? (
									<>
										<CardHeader>
											<CardTitle>{selectedChallenge.title}</CardTitle>
											<CardDescription>{selectedChallenge.description}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div>
												<label className="block mb-2 text-sm font-medium">
													Test String:
												</label>
												<div className="border rounded-md p-3 bg-muted/30 font-mono text-sm whitespace-pre-wrap break-all">
													{testString}
												</div>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium">
													Your Regular Expression:
												</label>
												<RegexInput pattern={pattern} flags={flags} onChange={setPattern} />
												{error && <p className="text-destructive text-sm mt-1">{error}</p>}
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium">
													Results:
												</label>
												<div className="border rounded-md p-4 bg-muted/30 min-h-[100px]">
													{results ? (
														<div className="space-y-3">
															<div className="font-mono text-sm whitespace-pre-wrap break-all">
																{highlightMatches()}
															</div>
															<Badge variant="outline">
																{results.matches.length} match
																{results.matches.length !== 1 ? "es" : ""} found
															</Badge>
														</div>
													) : (
														<p className="text-muted-foreground">
															Enter a pattern to see results
														</p>
													)}
												</div>
											</div>
											{showExplanation && (
												<div className="p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950 dark:border-amber-800">
													<div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
														<Lightbulb className="h-4 w-4" />
														<p className="text-sm font-medium">Hint:</p>
													</div>
													<p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
														{selectedChallenge.hint}
													</p>
												</div>
											)}
										</CardContent>
										<CardFooter className="flex justify-between">
											<Button variant="outline" onClick={() => setShowExplanation(!showExplanation)}>
												{showExplanation ? "Hide Hint" : "Show Hint"}
											</Button>
											<Button variant="secondary" onClick={() => setPattern(selectedChallenge.solution)}>
												Show Solution
											</Button>
										</CardFooter>
									</>
								) : (
									<div className="flex items-center justify-center h-[300px]">
										<p className="text-muted-foreground">Select a challenge to begin</p>
									</div>
								)}
							</Card>
						</div>
					</TabsContent>

					{/* Playground Tab */}
					<TabsContent value="playground">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="md:col-span-1">
								<CardHeader>
									<CardTitle>Common Patterns</CardTitle>
									<CardDescription>Click to use in playground</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									{commonPatterns.map((patternObj, idx) => (
										<div
											key={idx}
											className="p-3 bg-muted/50 hover:bg-muted rounded-md cursor-pointer transition-colors"
											onClick={() => applyCommonPattern(patternObj)}
										>
											<h3 className="font-medium">{patternObj.name}</h3>
											<p className="text-xs text-muted-foreground font-mono truncate">
												{patternObj.pattern}
											</p>
										</div>
									))}
								</CardContent>
							</Card>
							<Card className="md:col-span-2">
								<CardHeader>
									<CardTitle>Test Your Regex</CardTitle>
									<CardDescription>
										Experiment with patterns and see results in real-time
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<label className="block mb-2 text-sm font-medium">
											Regular Expression:
										</label>
										<RegexInput pattern={pattern} flags={flags} onChange={setPattern} />
										{error && <p className="text-destructive text-sm mt-1">{error}</p>}
									</div>
									<div>
										<label className="block mb-2 text-sm font-medium">Flags:</label>
										<FlagSelector />
										<p className="text-xs text-muted-foreground mt-2">
											g: global, i: case-insensitive, m: multiline, s: dot matches newlines, u:
											unicode, y: sticky
										</p>
									</div>
									<div>
										<label className="block mb-2 text-sm font-medium">Test String:</label>
										<Textarea
											value={testString}
											onChange={(e) => setTestString(e.target.value)}
											placeholder="Enter text to test your regex against"
											className="min-h-[100px]"
										/>
									</div>
									<div>
										<label className="block mb-2 text-sm font-medium">Results:</label>
										<div className="border rounded-md p-4 bg-muted/30 min-h-[100px]">
											{results ? (
												<div className="space-y-3">
													<div className="flex items-center">
														{results.test ? (
															<Badge
																variant="outline"
																className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
															>
																<Check className="mr-1 h-3 w-3" /> Pattern matches
															</Badge>
														) : (
															<Badge
																variant="outline"
																className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
															>
																<X className="mr-1 h-3 w-3" /> Pattern does not match
															</Badge>
														)}
													</div>
													{results.matches.length > 0 && (
														<div className="space-y-2">
															<p className="text-sm font-medium">
																Matches ({results.matches.length}):
															</p>
															<div className="font-mono text-sm whitespace-pre-wrap break-all p-3 bg-muted rounded-md">
																{highlightMatches()}
															</div>
															{results.matches.some((match) => match.groups.length > 0) && (
																<div className="mt-4">
																	<p className="text-sm font-medium">Capturing Groups:</p>
																	<ul className="list-disc ml-5 text-sm space-y-1 mt-2">
																		{results.matches.map((match, idx) =>
																			match.groups.length > 0 ? (
																				<li key={idx}>
																					Match {idx + 1}:{" "}
																					{match.groups.map((g, i) => (
																						<span key={i} className="text-primary">{`Group ${i + 1
																							}: "${g}" `}</span>
																					))}
																				</li>
																			) : null
																		)}
																	</ul>
																</div>
															)}
														</div>
													)}
												</div>
											) : (
												<p className="text-muted-foreground">
													Enter a pattern to see results
												</p>
											)}
										</div>
									</div>
								</CardContent>
								<CardFooter>
									<Card className="w-full bg-muted/30">
										<CardHeader className="py-3">
											<CardTitle className="text-sm">Quick Reference</CardTitle>
										</CardHeader>
										<CardContent className="py-3">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
												<div className="space-y-1">
													<p>
														<code className="bg-muted px-1 rounded">[abc]</code> - Matches any character in the set
													</p>
													<p>
														<code className="bg-muted px-1 rounded">[^abc]</code> - Matches any character not in the set
													</p>
													<p>
														<code className="bg-muted px-1 rounded">a|b</code> - Matches pattern a or pattern b
													</p>
													<p>
														<code className="bg-muted px-1 rounded">.</code> - Matches any character except newline
													</p>
													<p>
														<code className="bg-muted px-1 rounded">^</code> - Start of string anchor
													</p>
													<p>
														<code className="bg-muted px-1 rounded">$</code> - End of string anchor
													</p>
												</div>
												<div className="space-y-1">
													<p>
														<code className="bg-muted px-1 rounded">*</code> - 0 or more
													</p>
													<p>
														<code className="bg-muted px-1 rounded">+</code> - 1 or more
													</p>
													<p>
														<code className="bg-muted px-1 rounded">?</code> - 0 or 1
													</p>
													<p>
														<code className="bg-muted px-1 rounded">{"{n}"}</code> - Exactly n times
													</p>
													<p>
														<code className="bg-muted px-1 rounded">{"{n,}"}</code> - n or more times
													</p>
													<p>
														<code className="bg-muted px-1 rounded">{"{n,m}"}</code> - Between n and m times
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								</CardFooter>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default RegexTrainer;
