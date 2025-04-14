import React, { useState, useEffect } from 'react';

interface TimerProps {
  onTimeUp: () => void;
  key?: number;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const circumference = 2 * Math.PI * 45; // circle radius = 45
  const offset = circumference - (timeLeft / 30) * circumference;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke={timeLeft <= 10 ? '#EF4444' : '#3B82F6'}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-500'}`}>
            {timeLeft}
          </span>
          <span className="text-gray-500 text-sm block">seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;