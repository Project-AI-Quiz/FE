import { useState, useEffect } from 'react';
import { generateQuiz, submitAnswer } from '../services/api';

const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await generateQuiz('General Knowledge'); // Default topic
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = async (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    await submitAnswer(currentQuestion.id, selectedOption);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  return {
    questions,
    currentQuestionIndex,
    score,
    loading,
    error,
    handleAnswer,
    resetQuiz,
  };
};

export default useQuiz;