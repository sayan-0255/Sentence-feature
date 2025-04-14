import React from 'react';

interface ResultProps {
  questions: {
    sentence: string;
    options: string[];
    correctAnswer: string[];
  }[];
  userAnswers: string[][];
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ questions, userAnswers, onRestart }) => {
  const score = userAnswers.reduce((acc, answer, index) => {
    const isCorrect = questions[index].correctAnswer.every(
      (correct, i) => answer[i]?.toLowerCase() === correct.toLowerCase()
    );
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Results</h2>
        <div className="relative inline-block">
          <svg className="w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={percentage >= 70 ? '#22C55E' : percentage >= 40 ? '#F59E0B' : '#EF4444'}
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
              className="transition-all duration-1000 ease-out"
              transform="rotate(-90 96 96)"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-5xl font-bold mb-1">{score}</div>
            <div className="text-gray-500">out of {questions.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-xl mb-3">Performance Summary</h3>
        <p className="text-gray-700 leading-relaxed">
          {percentage >= 80 ? (
            "Outstanding performance! You've demonstrated excellent understanding of sentence construction and word usage."
          ) : percentage >= 60 ? (
            "Good effort! You're showing solid comprehension of sentence structure, with some room for improvement."
          ) : (
            "Keep practicing! Focus on understanding how different words affect the meaning of sentences."
          )}
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const isCorrect = question.correctAnswer.every(
            (correct, i) => userAnswers[index]?.[i]?.toLowerCase() === correct.toLowerCase()
          );
          return (
            <div key={index} className="border rounded-xl p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">Question {index + 1}</h4>
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <div className="text-gray-700 mb-4">{question.sentence}</div>
              
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="font-medium mb-2">Your Answer:</div>
                <p className="mb-2">{userAnswers[index]?.join(' ') || 'No answer provided'}</p>
                
                {!isCorrect && (
                  <>
                    <div className="font-medium text-green-700 mt-4">Correct Answer:</div>
                    <p className="text-green-600">{question.correctAnswer.join(' ')}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        className="w-full mt-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        Try Again
      </button>
    </div>
  );
};

export default Result;