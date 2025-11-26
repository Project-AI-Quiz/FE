import React, { useState } from 'react';
import { generateQuiz } from '../services/api';
import { QuizQuestion } from '../types/quiz';  
import Logo from '../assets/Logo_Agama.svg';


type QuizState = 'input' | 'playing' | 'finished';

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>('input');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customCount, setCustomCount] = useState<string>('');

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      setError('Silakan pilih materi terlebih dahulu');
      return;
    }
    const countToUse = customCount ? parseInt(customCount, 10) : questionCount;
    if (isNaN(countToUse) || countToUse <= 0) {
      setError('Jumlah pertanyaan tidak valid');
      return;
    }
    if (countToUse > 50) {
      setError('Maksimum 50 pertanyaan');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await generateQuiz(topic, countToUse);
      setQuestions(fetchedQuestions);
      setState('playing');
    } catch (err) {
      setError('Gagal memuat pertanyaan. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      setError('Silakan pilih jawaban terlebih dahulu');
      return;
    }

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);
    setError(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setState('finished');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const handleRestart = () => {
    setState('input');
    setTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setError(null);
    setQuestionCount(5);
    setCustomCount('');
  };

  // Input Topic Screen
  if (state === 'input') {
    const materiList = [
      'Manusia dalam pandangan Islam',
      'Agama Islam dan ruang lingkupnya',
      'Sumber ajaran Islam',
      'Hukum Islam dan HAM dalam Islam',
      'IPTEKS dalam perspektif Islam',
      'Kerukunan antar umat beragama',
      'Konsep masyarakat Madani dalam Islam',
      'Konsep kebudayaan dalam Islam',
      'Sistem politik Islam',
      'Konsep ekonomi dalam Islam',
      'Konsep keluarga dalam Islam',
      'Etika, moral dan akhlak dalam islam',
      'Peran agama dalam menghadapi permasalahan jihad, hijrah, literasi agama'
    ];
    const presetCounts = [5, 10, 15, 20, 25];
    return (
      <div className="container">
        <div className='logo-container'>
          <img 
            src={Logo} 
            alt="Logo" 
            style={{ width: '128px', height: '128px' }}
          />
        </div>
        <div className='title-container'>
          <span
            style={{
              fontSize: '32px',
            }}
          >
            <h1>Quizzis</h1>
          </span>
          <p
            style={{
              marginTop: '-35px'
            }}
          >
            Platform Quiz Pendidikan Agama Islam dengan AI
          </p>
        </div>
        <div style={{ marginTop: '25px' }}>
          
          <h3 style={{ marginBottom: '10px' }}>Materi:</h3>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#d9ead3',
              color: '#000000',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              outline: 'none',
              border: '4px solid #FFFFFF',
            }}
          >
            <option 
              value="" 
              disabled
              style={{color: '#000000' }}
            >
              Silahkan Pilih Materi
            </option>
            {materiList.map((m) => (
              <option key={m} value={m} style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                {m}
              </option>
            ))}
          </select>

          <div style={{ marginTop: '25px' }}>
            <h3 style={{ marginBottom: '10px' }}>Jumlah Pertanyaan:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {presetCounts.map(c => (
                <button
                  key={c}
                  onClick={() => { setQuestionCount(c); setCustomCount(''); }}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: (customCount === '' && questionCount === c) ? '#419423' : '#71b05b',
                    border: (customCount === '' && questionCount === c) ? '2px solid #419423' : '1px solid #71b05b',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >{c}</button>
              ))}
              <input
                type="number"
                placeholder="?"
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                style={{
                  width: '33px',
                  padding: '10px',
                  backgroundColor: '#71b05b',
                  border: '1px solid #71b05b',
                  color: 'white',
                  fontSize: '1.2rem',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
          <button onClick={handleStartQuiz} disabled={loading} style={{ marginTop: '30px', width: '100%' }}>
            {loading ? 'Membuat Kuis...' : 'Mulai Kuis'}
          </button>
          {error && <p style={{ color: '#ef4444', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  if (state === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ 
            height: '8px', 
            backgroundColor: '#deedda', 
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{ 
              height: '100%', 
              width: `${progress}%`, 
              backgroundColor: '#419423',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        <h2
          style={{
            color: '#000000'
          }}
        >
          {currentQuestion.question}
        </h2>

        <div style={{ marginTop: '30px' }}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '10px',
                textAlign: 'left',
                backgroundColor: selectedAnswer === option ? '#419423' : '#71b05b',
                border: selectedAnswer === option ? '2px solid #419423' : '1px solid #71b05b',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedAnswer === option ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', marginTop: '10px' }}>{error}</p>}

        <button 
          onClick={handleNextQuestion}
          style={{ marginTop: '20px', width: '100%' }}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil'}
        </button>
      </div>
    );
  }

  // Results Screen
  if (state === 'finished') {
    const score = calculateScore();
    return (
      <div className="container">
        <h1>Hasil Kuis</h1>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: '#deedda',
          borderRadius: '10px',
          marginTop: '30px',
        }}>
          <h2 style={{ fontSize: '48px', margin: '20px 0' }}>{score.percentage}%</h2>
          <p style={{ fontSize: '24px', marginBottom: '30px' }}>
            {score.correct} dari {score.total} benar
          </p>
          {score.percentage >= 80 && <p style={{ color: '#000000' }}>🎉 Luar biasa!</p>}
          {score.percentage >= 60 && score.percentage < 80 && <p style={{ color: '#60a5fa' }}>👍 Bagus!</p>}
          {score.percentage < 60 && <p style={{ color: '#f59e0b' }}>💪 Terus belajar!</p>}
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>Review Jawaban:</h3>
          {questions.map((question, index) => (
            <div 
              key={index}
              style={{
                padding: '15px',
                marginTop: '15px',
                backgroundColor: '#deedda',
                borderRadius: '5px',
                borderLeft: `4px solid ${userAnswers[index] === question.correct_answer ? '#10b981' : '#ef4444'}`,
              }}
            >
              <p><strong>Q{index + 1}:</strong> {question.question}</p>
              <p style={{ color: '#333333', marginTop: '5px' }}>
                Jawaban Anda: <span style={{ 
                  color: userAnswers[index] === question.correct_answer ? '#10b981' : '#ef4444' 
                }}>
                  {userAnswers[index]}
                </span>
              </p>
              {userAnswers[index] !== question.correct_answer && (
                <p style={{ color: '#10b981', marginTop: '5px' }}>
                  Jawaban Benar: {question.correct_answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleRestart} style={{ marginTop: '30px', width: '100%' }}>
          Mulai Kuis Baru
        </button>
      </div>
    );
  }

  return null;
};

export default Quiz;