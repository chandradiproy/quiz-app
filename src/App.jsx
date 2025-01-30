import React from 'react';
// import { useQuizeStore } from './store/quiz.store.js';
import Quiz from './components/Quiz.jsx';
import darkBG from '../public/background/rm218-bb-07.jpg'
import lightBG from '../public/background/vivid-blurred-colorful-background.jpg'


function App() {
  // const { fetchQuestions, questions, loading } = useQuizeStore();

  return (
    <div className='App bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] ' >
     <Quiz/>
    </div>
  );
}

export default App;