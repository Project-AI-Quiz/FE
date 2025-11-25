import React from 'react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: { question: string; answer: string; correct: boolean }[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-blue-300 mb-4">📚 Quiz History</h2>
        <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-300 focus:outline-none mb-4">
          ×
        </button>
        <div className="max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-gray-400 text-center">No history available.</div>
          ) : (
            history.map((item, index) => (
              <div key={index} className={`p-2 rounded-lg ${item.correct ? 'bg-green-500' : 'bg-red-500'} mb-2`}>
                <p className="font-semibold">{item.question}</p>
                <p className="text-gray-200">Your answer: {item.answer}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;