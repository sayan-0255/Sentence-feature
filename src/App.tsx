import { useState, useEffect } from 'react';
import Question from './components/Question';
import Timer from './components/Timer';
import Result from './components/Result';

interface QuestionType {
  sentence: string;
  options: string[];
  correctAnswer: string[];
}

function App() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/questions')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch questions');
        return response.json();
      })
      .then(data => {
        // Handle both data structures (direct array or nested in data.questions)
        const questionArray = Array.isArray(data) ? data : data.questions || [];
        setQuestions(questionArray);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to load questions. Please make sure json-server is running on port 3001.');
        setIsLoading(false);
        console.error('Error fetching questions:', err);
      });
  }, []);

  const handleNext = (answer: string[]) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimerKey(prev => prev + 1); // Reset timer
    } else {
      setShowResult(true);
    }
  };

  const handleTimeUp = () => {
    handleNext([]);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimerKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-red-600 mb-4">Error</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {showResult ? (
          <Result
            questions={questions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
          />
        ) : (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sentence Construction Quiz</h1>
              <p className="text-gray-600 text-lg">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <Timer key={timerKey} onTimeUp={handleTimeUp} />
            <Question
              question={questions[currentQuestion]}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;