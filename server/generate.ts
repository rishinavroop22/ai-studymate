import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { validateStudyResult } from "../src/lib/validateResult";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
	throw new Error("GEMINI_API_KEY is missing. Add it to the server environment.");
}

const ai = new GoogleGenAI({ apiKey });
const app = express();

app.use(cors());
app.use(express.json());

const responseSchema = {
	type: Type.OBJECT,
	properties: {
		topic: { type: Type.STRING },
		flashcards: {
			type: Type.ARRAY,
			minItems: 8,
			maxItems: 8,
			items: {
				type: Type.OBJECT,
				properties: {
					question: { type: Type.STRING },
					answer: { type: Type.STRING },
				},
				required: ["question", "answer"],
			},
		},
		quiz: {
			type: Type.ARRAY,
			minItems: 5,
			maxItems: 5,
			items: {
				type: Type.OBJECT,
				properties: {
					question: { type: Type.STRING },
					options: {
						type: Type.ARRAY,
						minItems: 4,
						maxItems: 4,
						items: { type: Type.STRING },
					},
					correctAnswer: {
						type: Type.INTEGER,
						minimum: 0,
						maximum: 3,
						format: "int32",
					},
					explanation: { type: Type.STRING },
				},
				required: ["question", "options", "correctAnswer", "explanation"],
			},
		},
	},
	required: ["topic", "flashcards", "quiz"],
};

const sleep = (milliseconds: number) =>
	new Promise((resolve) => setTimeout(resolve, milliseconds));

app.post("/api/generate", async (req, res) => {
	const { prompt } = req.body as { prompt?: unknown };

	if (typeof prompt !== "string" || prompt.trim().length === 0) {
		res.status(400).json({ error: "A non-empty prompt is required." });
		return;
	}

	let response;
	const retryDelays = [1000, 2000];

	for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
		try {
			response = await ai.models.generateContent({
				model: "gemini-3.8-flash",
				contents: `Create a study set for this request: ${prompt.trim()}`,
				config: {
					responseMimeType: "application/json",
					responseJsonSchema: responseSchema,
				},
			});
			break;
		} catch (error) {
			console.error("Gemini API error:", error);
			const status = (error as { status?: unknown }).status;

			if (status !== 503 || attempt === retryDelays.length) {
				res.status(502).json({ error: "Failed to generate study material." });
				return;
			}

			await sleep(retryDelays[attempt]);
		}
	}

	if (!response) {
		res.status(502).json({ error: "Failed to generate study material." });
		return;
	}

	try {
		const parsedResult: unknown = JSON.parse(response.text ?? "");
		const studyResult = validateStudyResult(parsedResult);

		if (!studyResult) {
			res.status(502).json({ error: "Generated study material was invalid." });
			return;
		}

		res.json(studyResult);
	} catch {
		res.status(502).json({ error: "Generated study material was invalid." });
	}
});

app.listen(3001, () => {
	console.log("AI StudyMate server listening on port 3001");
});
