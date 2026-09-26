import { useState } from "react";
import type { Flashcard as FlashcardData } from "../types/study";
import { Flashcard } from "./Flashcard";

interface FlashcardDeckProps {
	cards: FlashcardData[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [revealed, setRevealed] = useState(false);

	if (cards.length === 0) {
		return null;
	}

	const currentCard = cards[currentCardIndex];

	const handlePrevious = () => {
		setCurrentCardIndex((index) => Math.max(index - 1, 0));
		setRevealed(false);
	};

	const handleNext = () => {
		setCurrentCardIndex((index) => Math.min(index + 1, cards.length - 1));
		setRevealed(false);
	};

	return (
		<section className="w-full space-y-5" aria-label="Flashcards">
			<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
				<h2 className="text-2xl font-bold text-slate-900">Flashcards</h2>
				<p className="text-sm font-medium text-slate-500">
					{currentCardIndex + 1} / {cards.length}
				</p>
			</div>

			<Flashcard
				card={currentCard}
				revealed={revealed}
				onReveal={() => setRevealed((isRevealed) => !isRevealed)}
			/>

			<div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
				<button
					type="button"
					onClick={handlePrevious}
					disabled={currentCardIndex === 0}
					className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={handleNext}
					disabled={currentCardIndex === cards.length - 1}
					className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
				>
					Next
				</button>
			</div>
		</section>
	);
}
