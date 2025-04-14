import React, { useState } from 'react';

interface QuestionProps {
  question: {
    sentence: string;
    options: string[];
    correctAnswer: string[];
  };
  onNext: (answer: string[]) => void;
}

const Question: React.FC<QuestionProps> = ({ question, onNext }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const blanks = question.sentence.split('__');

  const handleSelect = (word: string) => {
    if (selectedWords.length < blanks.length - 1) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleUnselect = (index: number) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onNext(selectedWords);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Fill in the blanks in order</h2>
      
      <div className="mb-8 text-lg leading-relaxed bg-gray-50 p-6 rounded-xl">
        {blanks.map((part, index) => (
          <span key={index} className="text-gray-700">
            {part}
            {index < blanks.length - 1 && (
              <span
                onClick={() => handleUnselect(index)}
                className={`inline-block min-w-[100px] text-center mx-2 px-4 py-2 rounded-lg ${
                  selectedWords[index]
                    ? 'bg-blue-100 border-2 border-blue-400 text-blue-700 cursor-pointer hover:bg-blue-50'
                    : 'border-2 border-dashed border-gray-300 text-gray-400'
                }`}
              >
                {selectedWords[index] || '_____'}
              </span>
            )}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            disabled={selectedWords.includes(option)}
            className={`p-4 text-lg rounded-xl transition-all transform hover:scale-105 ${
              selectedWords.includes(option)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedWords.length !== blanks.length - 1}
        className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition-all transform hover:scale-105 ${
          selectedWords.length === blanks.length - 1
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Next Question
      </button>
    </div>
  );
};

export default Question;