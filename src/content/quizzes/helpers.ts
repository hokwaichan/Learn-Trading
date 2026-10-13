import type { ChartExample, Quiz, QuizQuestion } from '@/types';

export interface QuestionInput {
  prompt: string;
  choices: string[];
  /** Position of the right answer in `choices`, starting at 0. */
  correct: number;
  explanation: string;
  chart?: ChartExample;
}

/**
 * One quiz question: q('Prompt?', ['A', 'B', 'C'], 1, 'Why B is right.').
 * The third argument is the position of the right answer, starting at 0.
 */
export const q = (
  prompt: string,
  choices: string[],
  correct: number,
  explanation: string,
  chart?: ChartExample,
): QuestionInput => ({ prompt, choices, correct, explanation, chart });

/** Builds the quizzes for one module from { lessonId: [questions] }. */
export function defineQuizzes(moduleId: string, byLesson: Record<string, QuestionInput[]>): Quiz[] {
  return Object.entries(byLesson).map(([lessonId, questions]) => ({
    id: `${moduleId}/${lessonId}`,
    lessonId,
    questions: questions.map(
      (input, i): QuizQuestion => ({
        id: `${moduleId}/${lessonId}/${i + 1}`,
        prompt: input.prompt,
        choices: input.choices.map((text, c) => ({ id: String.fromCharCode(97 + c), text })),
        correctChoiceId: String.fromCharCode(97 + input.correct),
        explanation: input.explanation,
        chart: input.chart,
      }),
    ),
  }));
}
