import axios from 'axios';
import { GenerateQuizResponse, QuizQuestion } from '../types/quiz';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateQuiz = async (topic: string, count: number): Promise<QuizQuestion[]> => {
  try {
    const response = await axios.post<GenerateQuizResponse>(`${API_BASE_URL}/quiz/generate-quiz`, {
      topic,
      count,
    });
    return response.data.quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};