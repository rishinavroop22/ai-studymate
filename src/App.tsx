import { useRef, useState } from "react";
import { PromptInput } from "./components/PromptInput";
import { FlashcardDeck } from "./components/FlashcardDeck";
import { Quiz } from "./components/Quiz";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { generateStudyMaterial } from "./lib/api";
import type { Difficulty, StudyResult } from "./types/study";

const USE_DEV_MOCK_RESULT = false;

const DEV_MOCK_STUDY_RESULT: StudyResult = {
  topic: "Java OOP",
  flashcards: [
    {
      question: "What does OOP stand for in Java?",
      answer: "Object-oriented programming, a style of programming organized around objects and their behavior.",
    },
    {
      question: "What is a class in Java?",
      answer: "A class is a blueprint that defines the data and behavior shared by its objects.",
    },
    {
      question: "What is an object in Java?",
      answer: "An object is an instance of a class with its own state and access to the class behavior.",
    },
    {
      question: "What is encapsulation?",
      answer: "Encapsulation bundles data with methods and controls access to that data, often with private fields and public methods.",
    },
    {
      question: "What is inheritance?",
      answer: "Inheritance allows a class to reuse and extend the fields and methods of another class.",
    },
    {
      question: "What is polymorphism?",
      answer: "Polymorphism allows one interface or parent type to represent objects with different implementations.",
    },
    {
      question: "What is method overriding?",
      answer: "Method overriding happens when a subclass provides its own implementation of an inherited method.",
    },
    {
      question: "What is an interface in Java?",
      answer: "An interface defines a contract of methods that implementing classes agree to provide.",
    },
  ],
  quiz: [
    {
      question: "Which keyword creates a subclass in Java?",
      options: ["extends", "inherits", "subclass", "super"],
      correctAnswer: 0,
      explanation: "The extends keyword declares that one class inherits from another class.",
    },
    {
      question: "Which access modifier best supports encapsulation for a field?",
      options: ["private", "public", "static", "final"],
      correctAnswer: 0,
      explanation: "A private field cannot be accessed directly from outside its class, so access can be controlled through methods.",
    },
    {
      question: "What is a method with the same name but different parameters called?",
      options: ["Overloaded", "Overridden", "Inherited", "Abstract"],
      correctAnswer: 0,
      explanation: "Method overloading defines multiple methods with the same name but different parameter lists.",
    },
    {
      question: "Which keyword refers to the current object?",
      options: ["this", "self", "current", "object"],
      correctAnswer: 0,
      explanation: "In Java, this refers to the current object instance.",
    },
    {
      question: "Which type can refer to an object of any class?",
      options: ["Object", "Any", "Universal", "Base"],
      correctAnswer: 0,
      explanation: "Object is the root class of the Java class hierarchy, so an Object reference can point to any class instance.",
    },
  ],
};

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<StudyResult | null>(
    USE_DEV_MOCK_RESULT ? DEV_MOCK_STUDY_RESULT : null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const requestIdRef = useRef(0);
  const lastSubmittedRequestRef = useRef<{
    prompt: string;
    difficulty: Difficulty;
  } | null>(null);

  const generateForPrompt = async (
    submittedPrompt: string,
    submittedDifficulty: Difficulty,
  ) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const studyResult = await generateStudyMaterial(
        submittedPrompt,
        submittedDifficulty,
      );

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!studyResult) {
        setError("Unable to generate study material. Please try again.");
        return;
      }

      setResult(studyResult);
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Unable to generate study material. Please try again.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleGenerate = () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    lastSubmittedRequestRef.current = {
      prompt: trimmedPrompt,
      difficulty,
    };
    void generateForPrompt(trimmedPrompt, difficulty);
  };

  const handleRetry = () => {
    if (lastSubmittedRequestRef.current) {
      void generateForPrompt(
        lastSubmittedRequestRef.current.prompt,
        lastSubmittedRequestRef.current.difficulty,
      );
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,rgba(224,231,255,0.7),transparent_38%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header>
          <div className="mb-5 flex items-center gap-3 text-sm font-semibold text-indigo-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-sm">
              A
            </span>
            <span>AI-powered study companion</span>
          </div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            AI StudyMate
          </h1>
          <p className="mt-3 text-xl font-semibold tracking-tight text-slate-700 sm:text-2xl">
            Learn smarter. Test yourself.
          </p>
          {!result && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Turn any topic, question, or notes into interactive flashcards and quizzes you can use to study with confidence.
            </p>
          )}
        </header>

        <div className="space-y-4">
          <div className="max-w-xs space-y-2">
            <label htmlFor="study-difficulty" className="text-sm font-semibold text-slate-800">
              Difficulty
            </label>
            <select
              id="study-difficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-64"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            loading={loading}
          />
        </div>

        {!result && !loading && !error && (
          <>
            <section aria-labelledby="quick-start-heading" className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 id="quick-start-heading" className="text-sm font-semibold text-slate-800">
                  Start with an example
                </h2>
                <span className="text-xs text-slate-400">Pick a topic to begin</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Java OOP", "Operating Systems", "DBMS"].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.98]"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="feature-heading" className="space-y-3">
              <h2 id="feature-heading" className="text-sm font-semibold text-slate-800">
                Your study set includes
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Flashcards</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Learn key concepts with interactive cards.
                  </p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Quick Quiz</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Test yourself with multiple-choice questions.
                  </p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Instant Feedback</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Get explanations and track your score.
                  </p>
                </article>
              </div>
            </section>
          </>
        )}

        <section className="space-y-3" aria-live="polite">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} onRetry={handleRetry} />}
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
              <Quiz questions={result.quiz} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;