# AI StudyMate

AI StudyMate is an AI-powered study assistant that turns free-form study input into structured flashcards and multiple-choice quizzes.

## Live Demo

Frontend: https://ai-studymate-ik6t.onrender.com/

Backend: https://ai-studymate-api.onrender.com

Repository: https://github.com/rishinavroop22/ai-studymate

## Features

- Free-form topic, question, or notes input
- AI-generated structured study material
- 8 flashcards per study set
- 5 multiple-choice quiz questions with 4 options each
- Flashcard answer reveal and navigation
- Quiz scoring, explanations, and progress
- Retry Incorrect Questions without another AI request
- Restart quiz
- Beginner, Intermediate, and Advanced difficulty levels
- Quick-start topic suggestions
- 2,000-character input limit
- Ctrl + Enter submission
- Loading state
- Error state with retry
- Empty-input handling
- Stale-response protection
- Responsive, mobile-friendly UI

## How It Works

1. The user enters a topic, question, or notes.
2. React sends the prompt and selected difficulty to the Express backend.
3. The backend sends the request to Gemini.
4. Gemini is requested to return structured JSON matching the expected schema.
5. The backend parses the JSON response.
6. Zod validates the generated structure before it is returned to the frontend.
7. React stores the validated `StudyResult` in state.
8. Flashcards and quiz questions render as interactive components.
9. Quiz state is managed locally, including selected answers, score, and incorrect-question retry.

AI StudyMate is a structured-data interactive study tool, not a chatbot.

## Architecture

```text
User
  ↓
React + TypeScript + Vite
  ↓
Express backend
  ↓
Gemini API
  ↓
Structured JSON
  ↓
JSON parsing + Zod validation
  ↓
StudyResult
  ↓
Flashcards + Interactive Quiz
```

The Gemini API key is kept on the backend and is never exposed to the browser.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- Node.js
- Gemini API
- `@google/genai`
- Zod
- Render
- GitHub

## AI Integration

Gemini is called from the Express backend. The frontend never calls Gemini directly. The backend requests JSON structured according to the response schema, containing:

- `topic`
- 8 flashcards with questions and answers
- 5 quiz questions
- 4 options per quiz question
- A zero-based correct answer index
- An explanation for each question

The selected difficulty is sent to the backend and included in the generation request. The backend validates the generated result before returning it. Generated content depends on the model response and is not guaranteed to be correct.

## Structured Output and Validation

Structured output gives the frontend a predictable data shape to render. Gemini is requested to return JSON, the backend parses the response, and Zod validates the expected `StudyResult` structure. Invalid JSON or invalid generated data is rejected instead of being rendered directly. The frontend receives only the validated study result from the backend.

This matters for AI applications because model output can be malformed or have an unexpected shape.

## Error Handling and Reliability

- Empty prompts are rejected.
- Invalid difficulty values are rejected by the backend.
- Gemini failures return an error response.
- Gemini 503 responses are retried with short delays.
- Invalid JSON and invalid generated structures are rejected through Zod validation.
- A loading state is shown during generation.
- The user-facing error state includes retry functionality.
- Request IDs prevent stale responses from overwriting newer requests.
- Existing study results are cleared when a new generation starts, so stale content is not presented as the latest result.

## Interactive UI

- `PromptInput` provides the study prompt, character limit, quick-start topic suggestions, and Ctrl + Enter support; `App.tsx` owns difficulty selection and generation state.
- `Flashcard` displays a question and toggles its answer.
- `FlashcardDeck` manages the current flashcard and navigation.
- `Quiz` manages question progression, selected answers, scoring, explanations, and incorrect-question retry.
- `LoadingState` displays generation progress.
- `ErrorState` displays a concise error and Retry action.

React state controls the current flashcard, answer reveal, quiz question, selected answer, quiz score, incorrect-question retry, and loading/error/result state.

## Retry Incorrect Questions

After completing the quiz, incorrectly answered questions can be retried using the existing generated quiz data. Retry does not make another Gemini request, and the original quiz data is not mutated. Restart Quiz restores the full original quiz.

## Project Structure

```text
src/
  components/
    PromptInput.tsx
    Flashcard.tsx
    FlashcardDeck.tsx
    Quiz.tsx
    ResultSummary.tsx
    LoadingState.tsx
    ErrorState.tsx
  lib/
    api.ts
    validateResult.ts
  types/
    study.ts
  App.tsx

server/
  generate.ts

vite.config.ts
package.json
.env.example
README.md
```

`ResultSummary.tsx` is present in the project structure but is not currently rendered by `App.tsx`.

## Local Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

The development command starts the Vite frontend and the Express backend through the existing project setup. Vite proxies local `/api` requests to the backend.

## Environment Variables

### `GEMINI_API_KEY`

- Required by the backend.
- Must remain server-side.
- Must never be committed to Git.

```env
GEMINI_API_KEY=your_gemini_api_key
```

### `VITE_API_URL`

Optional for local development because the Vite proxy handles `/api` requests. In the deployed frontend, it points to the deployed Express backend.

```env
VITE_API_URL=https://your-backend-url.example.com
```

## Usage

1. Enter a study topic, question, or notes.
2. Select Beginner, Intermediate, or Advanced.
3. Click Generate Study Set or press Ctrl + Enter.
4. Review the generated flashcards.
5. Reveal answers and navigate through the cards.
6. Take the quiz.
7. Review explanations and score.
8. Retry incorrect questions if needed.
9. Restart the quiz when desired.

## Deployment

- Frontend: Render Static Site
- Backend: Render Web Service
- The frontend uses `VITE_API_URL` to communicate with the deployed backend.
- The Gemini API key is stored as a backend environment variable.
- The frontend does not contain the Gemini API key.

Frontend: https://ai-studymate-ik6t.onrender.com/

Backend: https://ai-studymate-api.onrender.com

## Design Decisions

- React state manages interactive flashcard and quiz behavior.
- Express acts as a backend proxy so the Gemini API key is not exposed.
- Structured JSON makes AI output predictable enough to render as UI.
- Zod provides runtime validation of generated data.
- Retry Incorrect Questions reuses existing quiz data instead of making another LLM request.
- The application avoids unnecessary complexity such as authentication, database persistence, RAG, agents, or vector databases because those are outside the assignment's core scope.

## Known Limitations

- Generated study content depends on the quality and accuracy of the Gemini response.
- Each study set currently contains 8 flashcards and 5 quiz questions.
- Study sessions are not persisted after a page refresh.
- No authentication or user accounts are implemented.
- Gemini availability and rate limits can affect generation.
- The application currently focuses on the study-assistant use case.

## AI Usage Note

GitHub Copilot was used to assist with component scaffolding, implementation suggestions, error-handling patterns, and code refinement. The generated code was reviewed, tested, modified, and integrated manually. The final architecture, feature decisions, testing, deployment configuration, and implementation were reviewed and understood by the author.

## Time Spent

Approximately 5 hours of implementation, testing, and deployment, excluding documentation.

## Future Improvements

The following are future work, not implemented features:

- Persist study sessions
- Authentication and user accounts
- More configurable study-set sizes
- Streaming generation
- Additional study formats
