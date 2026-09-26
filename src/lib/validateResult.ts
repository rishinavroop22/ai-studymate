import { z } from "zod";
import type { StudyResult } from "../types/study";

const flashcardSchema = z.object({
	question: z.string().min(1),
	answer: z.string().min(1),
});

const quizQuestionSchema = z.object({
	question: z.string().min(1),
	options: z.array(z.string().min(1)).length(4),
	correctAnswer: z.number().int().min(0).max(3),
	explanation: z.string().min(1),
});

export const studyResultSchema = z.object({
	topic: z.string().min(1),
	flashcards: z.array(flashcardSchema),
	quiz: z.array(quizQuestionSchema),
});

export function validateStudyResult(data: unknown): StudyResult | null {
	const result = studyResultSchema.safeParse(data);

	return result.success ? result.data : null;
}
