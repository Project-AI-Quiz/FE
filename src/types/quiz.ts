export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface GenerateQuizResponse {
  quiz: QuizQuestion[];
}

export interface QuizResult {
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  score: number;
}
