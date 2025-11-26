import React, { useState, useEffect } from 'react';
import { generateQuiz, getUploadedFiles } from '../services/api';
import { QuizQuestion } from '../types/quiz';  
import Logo from '../assets/Logo_Agama.svg';
import { FaEdit, FaFile, FaRocket, FaChevronRight, FaFlag, FaCheckCircle, FaExclamationCircle, FaSync } from 'react-icons/fa';
import { MdAssignmentTurnedIn, MdOutlineFitnessCenter, MdCheckCircle, MdCancel } from 'react-icons/md';

type QuizState = 'input' | 'playing' | 'finished';
type SourceType = 'manual' | 'uploaded';

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>('input');
  const [sourceType, setSourceType] = useState<SourceType>('manual');
  const [topic, setTopic] = useState('');
  const [selectedUploadedFile, setSelectedUploadedFile] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [customCount, setCustomCount] = useState<string>('');

  useEffect(() => {
    if (sourceType === 'uploaded') {
      fetchUploadedFiles();
    }
  }, [sourceType]);

  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
    } catch (err) {
      setError('Gagal memuat daftar file dari uploads');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleStartQuiz = async () => {
    if (sourceType === 'manual' && !topic.trim()) {
      setError('Silakan pilih materi terlebih dahulu');
      return;
    }
    if (sourceType === 'uploaded' && !selectedUploadedFile) {
      setError('Silakan pilih file dari uploads');
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
      const fetchedQuestions = sourceType === 'uploaded'
        ? await generateQuiz('', countToUse, selectedUploadedFile)
        : await generateQuiz(topic, countToUse);
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
    setSourceType('manual');
    setTopic('');
    setSelectedUploadedFile('');
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
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 py-12 px-4 animate-fade-in-up">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <img 
                src={Logo} 
                alt="Logo" 
                className="w-28 h-28 drop-shadow-md hover:drop-shadow-lg transition-all duration-500"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-3 tracking-tight animate-scale-in">
              Quizzis
            </h1>
            <p className="text-lg text-green-700 font-medium animate-slide-in-right">
              Platform Quiz PAI Berbasis AI
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            <div className="p-8 md:p-10">
              {/* Source Type Toggle */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setSourceType('manual'); setError(null); }}
                    className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                      sourceType === 'manual'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-lg'
                        : 'bg-white text-green-700 border-green-200 hover:border-green-400'
                    }`}
                    disabled
                  >
                    <FaEdit className="text-lg" /> Topik Manual
                  </button>
                  <button
                    onClick={() => { setSourceType('uploaded'); setError(null); }}
                    className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                      sourceType === 'uploaded'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-lg'
                        : 'bg-white text-green-700 border-green-200 hover:border-green-400'
                    }`}
                    disabled
                  >
                    <FaFile className="text-lg" /> File Upload
                  </button> 
                </div>
              </div>

              {/* Content Section */}
              <div className="mb-8">
                {sourceType === 'manual' ? (
                  <>
                    <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">
                      Pilih Materi Pembelajaran
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-green-900 bg-white font-medium transition-all"
                    >
                      <option value="" disabled>
                        Silahkan Pilih Materi
                      </option>
                      {materiList.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">
                      Pilih File dari Uploads
                    </label>
                    {loadingFiles ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-green-600 font-medium">Memuat daftar file...</p>
                        </div>
                      </div>
                    ) : uploadedFiles.length === 0 ? (
                      <div className="bg-green-50 rounded-xl py-8 text-center border-2 border-dashed border-green-300">
                        <p className="text-green-600 font-medium">📁 Tidak ada file di folder uploads</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {uploadedFiles.map((filename) => (
                          <button
                            key={filename}
                            onClick={() => setSelectedUploadedFile(filename)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 border-2 ${
                              selectedUploadedFile === filename
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-md'
                                : 'bg-white text-green-700 border-green-200 hover:border-green-400'
                            }`}
                          >
                            <FaFile className="text-lg flex-shrink-0" />
                            <span className="truncate">{filename}</span>
                            {selectedUploadedFile === filename && <MdCheckCircle className="ml-auto flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Question Count Section */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">
                  Jumlah Pertanyaan
                </label>
                <div className="flex flex-wrap gap-3">
                  {presetCounts.map(c => (
                    <button
                      key={c}
                      onClick={() => { setQuestionCount(c); setCustomCount(''); }}
                      className={`px-5 py-2 rounded-lg font-semibold transition-all border-2 ${
                        customCount === '' && questionCount === c
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-md'
                          : 'bg-white text-green-700 border-green-200 hover:border-green-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                  <input
                    type="number"
                    placeholder="?"
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    className="w-16 px-3 py-2 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-center font-semibold text-green-900"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <p className="text-red-700 font-medium flex items-center gap-2"><FaExclamationCircle /> {error}</p>
                </div>
              )}

              {/* Start Button */}
              <button
                onClick={handleStartQuiz}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Membuat Kuis...
                  </span>
                ) : (
                  <>
                    <FaRocket className="text-lg" /> Mulai Kuis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  if (state === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 py-8 px-4 animate-fade-in-up">
        <div className="max-w-3xl mx-auto">
          {/* Header with Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Pertanyaan <span className="font-bold text-green-900">{currentQuestionIndex + 1}</span> dari <span className="font-bold text-green-900">{questions.length}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{Math.round(progress)}%</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-green-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-1.5"></div>
            
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-8 leading-tight animate-slide-in-right" style={{ animationDelay: '0.15s' }}>
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 animate-fade-in-up ${
                      selectedAnswer === option
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-lg'
                        : 'bg-white text-green-900 border-green-200 hover:border-green-400'
                    }`}
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        selectedAnswer === option
                          ? 'bg-white text-green-600'
                          : 'bg-green-200 text-green-900'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < questions.length - 1
                  ? <>
                      <span>Pertanyaan Berikutnya</span>
                      <FaChevronRight className="text-lg" />
                    </>
                  : <>
                      <span>Lihat Hasil</span>
                      <FaFlag className="text-lg" />
                    </>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === 'finished') {
    const score = calculateScore();
    const scoreColor = score.percentage >= 80 ? 'from-green-500 to-emerald-500' : score.percentage >= 60 ? 'from-emerald-500 to-teal-500' : 'from-yellow-500 to-orange-500';
    const emoji = score.percentage >= 80 ? 'celebrate' : score.percentage >= 60 ? 'thumbsup' : 'strong';
    const message = score.percentage >= 80 ? 'Luar biasa!' : score.percentage >= 60 ? 'Sangat bagus!' : 'Terus belajar!';

    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 py-8 px-4 animate-fade-in-up">
        <div className="max-w-3xl mx-auto">
          {/* Score Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-green-100 animate-fade-in-up">
            <div className={`bg-gradient-to-r ${scoreColor} h-1.5`}></div>
            
            <div className="p-8 text-center">
              <h1 className="text-4xl font-bold text-green-900 mb-8 animate-scale-in">Hasil Kuis</h1>
              
              <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse">
                  {score.percentage}%
                </div>
                <p className="text-2xl text-green-700 font-semibold mb-2">
                  {score.correct} dari {score.total} benar
                </p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                  {emoji === 'celebrate' && <span className="text-4xl">🎉</span>}
                  {emoji === 'thumbsup' && <span className="text-4xl">👍</span>}
                  {emoji === 'strong' && <span className="text-4xl">💪</span>}
                  {message}
                </p>
              </div>

              {/* Score Details */}
              <div className="grid grid-cols-3 gap-4 mb-8 bg-green-50 p-6 rounded-xl border border-green-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div>
                  <p className="text-sm text-green-700 font-medium">Benar</p>
                  <p className="text-2xl font-bold text-green-900">{score.correct}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Salah</p>
                  <p className="text-2xl font-bold text-red-600">{score.total - score.correct}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Total</p>
                  <p className="text-2xl font-bold text-green-900">{score.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-green-100 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <h2 className="text-2xl font-bold text-green-900 mb-6 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>Review Jawaban</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const isCorrect = userAnswers[index] === question.correct_answer;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 transition-all animate-fade-in-up ${
                      isCorrect
                        ? 'bg-green-50 border-green-400'
                        : 'bg-red-50 border-red-400'
                    }`}
                    style={{ animationDelay: `${0.35 + index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className={`text-lg font-bold flex items-center ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                        {isCorrect ? <MdCheckCircle className="text-xl" /> : <MdCancel className="text-xl" />}
                      </span>
                      <p className="font-semibold text-green-900">
                        <span className="text-green-700">Q{index + 1}:</span> {question.question}
                      </p>
                    </div>
                    
                    <div className="ml-8 space-y-1">
                      <p className={`text-sm ${isCorrect ? 'text-green-900' : 'text-green-900'}`}>
                        <span className="font-semibold">Jawaban Anda:</span>{' '}
                        <span className={isCorrect ? 'font-bold text-green-900' : 'font-bold text-red-600'}>
                          {userAnswers[index]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-900">
                          <span className="font-semibold">Jawaban Benar:</span>{' '}
                          <span className="font-bold text-green-700">{question.correct_answer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <FaSync className="text-lg" />
            <span>Mulai Kuis Baru</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;