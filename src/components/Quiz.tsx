import { useState } from "react";
import type { QuizQuestion } from "../types/study";

interface QuizProps {
	questions: QuizQuestion[];
}

export function Quiz({ questions }: QuizProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [answers, setAnswers] = useState<number[]>([]);
	const [isComplete, setIsComplete] = useState(false);

	if (questions.length === 0) {
		return null;
	}

	if (isComplete) {
		const correctCount = answers.filter(
			(answer, index) => answer === questions[index]?.correctAnswer,
		).length;
		const incorrectCount = answers.length - correctCount;

		return (
			<section className="w-full space-y-5" aria-label="Quiz results">
				<div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
					<h2 className="text-2xl font-bold text-slate-900">Quiz Complete</h2>
					<p className="mt-3 text-lg text-slate-700">
						You scored {correctCount} out of {questions.length}
					</p>
					<div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:mx-auto sm:max-w-sm">
						<div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
							<p className="font-semibold">Correct</p>
							<p className="mt-1 text-lg font-bold">{correctCount}</p>
						</div>
						<div className="rounded-lg bg-red-50 p-3 text-red-700">
							<p className="font-semibold">Incorrect</p>
							<p className="mt-1 text-lg font-bold">{incorrectCount}</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => {
							setCurrentQuestionIndex(0);
							setSelectedAnswer(null);
							setAnswers([]);
							setIsComplete(false);
						}}
						className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Restart Quiz
					</button>
				</div>
			</section>
		);
	}

	const currentQuestion = questions[currentQuestionIndex];

	const handleNext = () => {
		if (selectedAnswer === null) {
			return;
		}

		const updatedAnswers = [...answers, selectedAnswer];
		setAnswers(updatedAnswers);

		if (currentQuestionIndex === questions.length - 1) {
			setIsComplete(true);
			return;
		}

		setCurrentQuestionIndex((index) => index + 1);
		setSelectedAnswer(null);
	};

	return (
		<section className="w-full space-y-5" aria-label="Quiz">
			<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
				<h2 className="text-2xl font-bold text-slate-900">Quiz</h2>
				<p className="text-sm font-medium text-slate-500">
					Question {currentQuestionIndex + 1} of {questions.length}
				</p>
			</div>

			<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
				<h3 className="text-lg font-semibold leading-7 text-slate-900">
					{currentQuestion.question}
				</h3>

				<div className="mt-5 grid gap-3">
					{currentQuestion.options.map((option, optionIndex) => {
						const isSelected = selectedAnswer === optionIndex;
						const isCorrect =
							selectedAnswer !== null && optionIndex === currentQuestion.correctAnswer;

						return (
							<button
								key={option}
								type="button"
								onClick={() => setSelectedAnswer(optionIndex)}
								disabled={selectedAnswer !== null}
								aria-pressed={isSelected}
								className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-default ${
									selectedAnswer === null
										? "border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
										: isCorrect
											? "border-emerald-500 bg-emerald-50 text-emerald-800"
											: isSelected
												? "border-red-500 bg-red-50 text-red-800"
												: "border-slate-200 text-slate-500"
								}`}
							>
								{option}
							</button>
						);
					})}
				</div>

				{selectedAnswer !== null && (
					<div className="mt-5 space-y-2 rounded-lg bg-slate-50 p-4">
						<p
							className={`font-semibold ${
								selectedAnswer === currentQuestion.correctAnswer
									? "text-emerald-700"
									: "text-red-700"
							}`}
						>
							{selectedAnswer === currentQuestion.correctAnswer
								? "Correct!"
								: "Incorrect"}
						</p>
						<p className="text-sm leading-6 text-slate-600">
							{currentQuestion.explanation}
						</p>
					</div>
				)}
			</div>

			<button
				type="button"
				onClick={handleNext}
				disabled={selectedAnswer === null}
				className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
			>
				Next
			</button>
		</section>
	);
}
