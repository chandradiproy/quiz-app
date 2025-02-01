import React, { useEffect, useState } from "react";
import { useQuizStore } from "../store/quiz.store"; // adjust the path if necessary
import { ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Quiz = () => {
  const {
    questions,
    score,
    loading,
    fetchQuestions,
    selectOption,
    isQuizStarted,
    setIsQuizStarted,
  } = useQuizStore();
  const { width, height } = useWindowSize();

  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected options for each question
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [detailedSolutions, setDetailedSolutions] = useState({}); // Track visibility of detailed solutions for each question

  // useEffect(() => {
  //   fetchQuestions();
  // }, [fetchQuestions]);

  // Handle option selection
  const handleSelectOption = (questionId, option) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelections = [...prevSelectedOptions];
      updatedSelections[questionId] = option; // Store selected option by question ID
      return updatedSelections;
    });
    selectOption(option); // Keep track of selected option in store if needed
  };

  // Handle submit
  const handleSubmit = () => {
    setQuizSubmitted(true); // Mark quiz as submitted
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleClick = () => {
    fetchQuestions();
    setIsQuizStarted(true);
  };

  // Toggle detailed answer visibility for a specific question
  const toggleDetailedSolution = (index) => {
    setDetailedSolutions((prevSolutions) => ({
      ...prevSolutions,
      [index]: !prevSolutions[index], // Toggle visibility of the detailed solution for the clicked question
    }));
  };

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen dark:bg-zinc-800/35 text-white flex flex-col items-center justify-center py-8">
        <div className="text-2xl font-semibold text-center">
          Hi, Please click the below button to start the quiz
        </div>
        <button
          onClick={handleClick}
          className="mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 hover:cursor-pointer text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-zinc-800/35 text-white flex flex-col items-center justify-center py-8">
      {loading ? (
        <div className="text-xl">Loading...</div>
      ) : (
        <div className="w-full flex items-center flex-col  max-w-4xl space-y-6">
          {quizSubmitted && (
            <div className="mt-6 text-center">
              {score > 7 && <Confetti  /> }
              

              <h3 className="text-2xl font-bold">Quiz Completed!</h3>
              <p className="text-xl">Your score: {score > 7 ? <span className="text-green-600">{score}</span> :  <span className="text-red-700">{score}</span> }</p>
            </div>
          )}
          {questions.map((question, index) => {
            const selectedOption = selectedOptions[index];
            const isSelectedQuestion = detailedSolutions[index]; // Check if detailed solution is visible for this question

            return (
              <div
                key={question.id}
                className="sm:w-full w-[90vw] dark:bg-gray-900/50 bg-white/30 backdrop-blur-3xl p-6 rounded-lg shadow-xl"
              >
                <h2 className="sm:text-xl text-[4vw] dark:text-gray-100 text-gray-700 font-bold  mb-4">
                  Q{index + 1}. {question.description}
                </h2>
                <h3 className="text-md dark:text-gray-400 text-gray-700 font-light mb-4">
                  #
                  {question.reading_material.keywords
                    ? Array.isArray(
                        JSON.parse(question.reading_material.keywords)
                      )
                      ? JSON.parse(question.reading_material.keywords).join(
                          " #"
                        )
                      : "No keywords available"
                    : "No keywords available"}
                </h3>

                <div className="space-y-4">
                  {question.options.map((option) => {
                    const isSelected =
                      selectedOption && selectedOption.id === option.id;
                    const isCorrect = option.is_correct;
                    const isIncorrect = isSelected && !isCorrect;

                    return (
                      <div
                        key={option.id}
                        className={`flex items-center space-x-2 border-2 dark:border-gray-200 border-gray-600/30 p-2 rounded-lg hover:cursor-pointer
                          ${
                            quizSubmitted
                              ? isCorrect
                                ? "border-green-500"
                                : isIncorrect
                                ? "border-red-500"
                                : ""
                              : isSelected
                              ? "bg-transparent"
                              : ""
                          }`}
                      >
                        <input
                          type="radio"
                          id={option.id}
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => handleSelectOption(index, option)}
                          className="w-4 h-4 bg-blue-600 border-blue-400"
                        />
                        <label
                          htmlFor={option.id}
                          className="text-lg dark:text-gray-100 text-gray-700 w-full"
                        >
                          {option.description}
                        </label>
                      </div>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-4">
                    <button
                      className="text-lg font-semibold text-cyan-500"
                      onClick={() => toggleDetailedSolution(index)}
                    >
                      {isSelectedQuestion ? (
                        <span className="flex items-center hover:cursor-pointer">
                          <span>Hide Answer</span>
                          <ChevronUp
                            size={25}
                            className="ml-2  transition-all delay-75 ease-in-out"
                          />
                        </span>
                      ) : (
                        <span className="flex items-center hover:cursor-pointer">
                          <span>Show Answer</span>
                          <ChevronUp
                            size={25}
                            className="ml-2 rotate-180 transition-all delay-75 ease-in-out"
                          />
                        </span>
                      )}
                    </button>

                    {isSelectedQuestion && (
                      <ReactMarkdown
                        remarkPlugins={remarkGfm}
                        className="text-sm text-gray-500 dark:text-gray-300 mt-2 prose prose-sm dark:prose-invert"
                      >
                        {question.detailed_solution ||
                          "No detailed solution available"}
                      </ReactMarkdown>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!quizSubmitted && (
            <div className="mt-6 w-full flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-fit py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
