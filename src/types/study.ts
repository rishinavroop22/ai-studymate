export interface Flashcard {
	question: string;
	answer: string;
}

export interface QuizQuestion {
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
}

export interface StudyResult {
	topic: string;
	flashcards: Flashcard[];
	quiz: QuizQuestion[];
}
