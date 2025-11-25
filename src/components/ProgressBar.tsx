import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="h-1.5 bg-gray-700 mb-6 rounded-full overflow-hidden">
      <div
        className="progress-bar h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;