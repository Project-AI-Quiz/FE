import axios from 'axios';
import { GenerateQuizResponse, QuizQuestion } from '../types/quiz';

const API_BASE_URL = 'https://be-agama.vercel.app/api';

export const generateQuiz = async (
  topic: string,
  count: number,
  uploadedFile?: string
): Promise<QuizQuestion[]> => {
  try {
    const payload: any = { count };
    
    if (uploadedFile) {
      // Jika menggunakan file dari uploads
      payload.uploadedFile = uploadedFile;
    } else if (topic) {
      // Jika manual topic
      payload.topic = topic;
    } else {
      throw new Error('Topic atau uploadedFile harus diisi');
    }
    
    const response = await axios.post<GenerateQuizResponse>(
      `${API_BASE_URL}/quiz/generate-quiz`,
      payload
    );
    return response.data.quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

/**
 * Get list of uploaded files from backend uploads folder
 */
export const getUploadedFiles = async (): Promise<string[]> => {
  try {
    const response = await axios.get<{ files: string[]; count: number }>(
      `${API_BASE_URL}/quiz/uploaded-files`
    );
    return response.data.files;
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    throw error;
  }
};

/**
 * Extract content from uploaded file
 */
export const extractUploadedFile = async (filename: string): Promise<string> => {
  try {
    const response = await axios.get<{ filename: string; content: string; contentLength: number }>(
      `${API_BASE_URL}/quiz/extract-uploaded/${encodeURIComponent(filename)}`
    );
    return response.data.content;
  } catch (error) {
    console.error('Error extracting uploaded file:', error);
    throw error;
  }
};