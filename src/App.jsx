import React from 'react';
// import { useQuizeStore } from './store/quiz.store.js';
import Quiz from './components/Quiz.jsx';


function App() {
  // const { fetchQuestions, questions, loading } = useQuizeStore();

  return (
<div className="App bg-gradient-to-r from-[#E2E2E2] to-[#C9D6FF] dark:from-[#24243e] dark:via-[#302b63] dark:to-[#0f0c29]">
  <Quiz />
</div>
  );
}

export default App;