import type { Difficulty, StudyResult } from "../types/study";

export async function generateStudyMaterial(
	prompt: string,
	difficulty: Difficulty = "intermediate",
): Promise<StudyResult> {
	const response = await fetch("/api/generate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ prompt, difficulty }),
	});

	if (!response.ok) {
		const errorData: unknown = await response.json().catch(() => null);
		const errorMessage =
			typeof errorData === "object" &&
			errorData !== null &&
			"error" in errorData &&
			typeof errorData.error === "string"
				? errorData.error
				: "Failed to generate study material.";

		throw new Error(errorMessage);
	}

	return (await response.json()) as StudyResult;
}
