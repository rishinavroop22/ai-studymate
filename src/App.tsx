import { useRef, useState } from "react";
import { PromptInput } from "./components/PromptInput";
import { FlashcardDeck } from "./components/FlashcardDeck";
import { Quiz } from "./components/Quiz";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { generateStudyMaterial } from "./lib/api";
import type { StudyResult } from "./types/study";

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
  const requestIdRef = useRef(0);
  const lastSubmittedPromptRef = useRef("");

  const generateForPrompt = async (submittedPrompt: string) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const studyResult = await generateStudyMaterial(submittedPrompt);

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

    lastSubmittedPromptRef.current = trimmedPrompt;
    void generateForPrompt(trimmedPrompt);
  };

  const handleRetry = () => {
    if (lastSubmittedPromptRef.current) {
      void generateForPrompt(lastSubmittedPromptRef.current);
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