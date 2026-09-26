import type { Difficulty, StudyResult } from "../types/study";

const apiBaseUrl =
	import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

const generateUrl = apiBaseUrl
	? `${apiBaseUrl}/api/generate`
	: "/api/generate";

export async function generateStudyMaterial(
	prompt: string,
	difficulty: Difficulty = "intermediate",
): Promise<StudyResult> {
	const response = await fetch(generateUrl, {
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