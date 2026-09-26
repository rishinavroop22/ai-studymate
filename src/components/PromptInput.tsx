import type { FormEvent, KeyboardEvent } from "react";

interface PromptInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	loading: boolean;
}

export function PromptInput({
	value,
	onChange,
	onSubmit,
	loading,
}: PromptInputProps) {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!loading && value.trim()) {
			onSubmit();
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.ctrlKey && event.key === "Enter" && !loading && value.trim()) {
			event.preventDefault();
			event.currentTarget.form?.requestSubmit();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="study-prompt"
					className="block text-sm font-medium text-slate-700"
				>
					Enter a topic, question, or notes to study
				</label>
				<textarea
					id="study-prompt"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					onKeyDown={handleKeyDown}
					disabled={loading}
					placeholder="e.g. Explain Java OOP concepts for a beginner..."
					rows={6}
					className="min-h-36 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
				/>
			</div>
			<button
				type="submit"
				disabled={loading || value.trim().length === 0}
				className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
			>
				{loading ? "Generating..." : "Generate Study Set"}
			</button>
		</form>
	);
}
