import type { Flashcard as FlashcardData } from "../types/study";

interface FlashcardProps {
	card: FlashcardData;
	revealed: boolean;
	onReveal: () => void;
}

export function Flashcard({ card, revealed, onReveal }: FlashcardProps) {
	return (
		<article className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
					Question
				</p>
				<p className="text-base leading-7 text-slate-900 sm:text-lg">{card.question}</p>
			</div>

			{revealed && (
				<div className="mt-6 space-y-2 border-t border-slate-200 pt-5">
					<p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
						Answer
					</p>
					<p className="text-base leading-7 text-slate-700 sm:text-lg">{card.answer}</p>
				</div>
			)}

			<button
				type="button"
				onClick={onReveal}
				className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
			>
				{revealed ? "Hide Answer" : "Show Answer"}
			</button>
		</article>
	);
}
