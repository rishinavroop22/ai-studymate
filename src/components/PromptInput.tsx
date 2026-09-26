import type { FormEvent, KeyboardEvent } from "react";

interface PromptInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	loading: boolean;
}

const MAX_PROMPT_LENGTH = 2000;

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
				<div className="flex items-center justify-between gap-3">
					<label
						htmlFor="study-prompt"
						className="block text-sm font-semibold text-slate-800"
					>
						Enter a topic, question, or notes to study
					</label>
					<span className="shrink-0 text-xs tabular-nums text-slate-400" aria-live="polite">
						{value.length} / {MAX_PROMPT_LENGTH}
					</span>
				</div>
				<textarea
					id="study-prompt"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					onKeyDown={handleKeyDown}
					disabled={loading}
					maxLength={MAX_PROMPT_LENGTH}
					aria-describedby="study-prompt-hint"
					placeholder="Try: Explain Java inheritance with a simple example..."
					rows={6}
					className="min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
				/>
				<p id="study-prompt-hint" className="text-xs text-slate-500">
					Press Ctrl + Enter to generate
				</p>
			</div>
			<button
				type="submit"
				disabled={loading || value.trim().length === 0}
				className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto"
			>
				{loading ? "Generating..." : "Generate Study Set"}
			</button>
		</form>
	);
}
