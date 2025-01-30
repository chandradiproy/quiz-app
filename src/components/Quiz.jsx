import React, { useEffect } from "react";
import { useQuizStore } from "../store/quiz.store";  // adjust the path if necessary

const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    score,
    feedback,
    detailedSolution,
    quizCompleted,
    loading,
    fetchQuestions,
    selectOption,
    nextQuestion,
  } = useQuizStore();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white text-white flex flex-col items-center justify-center py-8">
      {loading ? (
        <div className="text-xl">Loading...</div>
      ) : quizCompleted ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl">Your score: {score}</p>
        </div>
      ) : (
        <div className="w-full max-w-lg dark:bg-gray-800/50 bg-gray-200/70  backdrop-blur-3xl p-6 rounded-lg shadow-lg">
          <h2 className="text-xl dark:text-gray-100 text-gray-700 font-semibold mb-4">
            Q{currentQuestionIndex + 1}. {currentQuestion?.description}
          </h2>
          <h2 className="text-md dark:text-gray-100 text-gray-700 font-light mb-4">
            #{currentQuestion?.topic}
          </h2>

          {/* Radio buttons for options */}
          <div className="space-y-4">
            {currentQuestion?.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option.id}
                  name="quiz-option"
                  value={option.id}
                  onChange={() => selectOption(option)} // Select option when clicked
                  className="w-4 h-4 bg-blue-600 border-blue-400 focus:ring-2 focus:ring-blue-400"
                />
                <label
                  htmlFor={option.id}
                  className="text-lg dark:text-gray-100 text-gray-700"
                >
                  {option.description}
                </label>
              </div>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 text-xl font-semibold">
              <p>{feedback}</p>
              <p className="text-sm text-gray-400">{detailedSolution}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={nextQuestion}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
