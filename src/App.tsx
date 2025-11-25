import React from 'react';
import Quiz from './components/Quiz';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Quiz />
    </div>
  );
};

export default App;