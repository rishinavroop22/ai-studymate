import { useState } from "react";
import { PromptInput } from "./components/PromptInput";
import { FlashcardDeck } from "./components/FlashcardDeck";
import { generateStudyMaterial } from "./lib/api";
import type { StudyResult } from "./types/study";

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<StudyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const studyResult = await generateStudyMaterial(trimmedPrompt);
      setResult(studyResult);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to generate study material.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">AI StudyMate</h1>
        </header>

        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleGenerate}
          loading={loading}
        />

        <section className="space-y-3" aria-live="polite">
          {loading && <p className="text-sm text-slate-600">Generating your study set...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {result && (
            <>
              <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-semibold">{result.topic}</p>
                <p className="text-sm text-slate-600">
                  {result.flashcards.length} flashcards
                </p>
                <p className="text-sm text-slate-600">{result.quiz.length} quiz questions</p>
              </div>
              <FlashcardDeck cards={result.flashcards} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;