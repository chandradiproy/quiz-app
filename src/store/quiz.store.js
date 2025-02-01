import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.PROD
  ? "https://cors-anywhere-ih3q.onrender.com/https://api.jsonserve.com/Uw5CrX"
  : "/api";

export const useQuizStore = create((set) => ({
  questions: [], // for storing the questions
  currentQuestionIndex: 0, // for tracking the current question index
  score: 0, // for tracking the score
  loading: false, // for tracking the loading state
  feedback: null, // for storing the feedback
  detailedSolution: null, // for storing the detailed solution
  quizCompleted: false, // for tracking the quiz completion
  isQuizStarted: false, // for tracking the quiz start

  setIsQuizStarted: (value) => {
    set({ isQuizStarted: value });
  },

  fetchQuestions: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        API_URL,
        {
          headers: {
            "x-requested-with": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
          },
        }
      );
      set({ questions: response.data?.questions || [], loading: false });
      console.log("Questions fetched successfully", response.data.questions);
    } catch (error) {
      console.error("Error fetching questions", error);
      set({ loading: false });
    }
  },

  selectOption: (option) => {
    set((state) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = option.is_correct;
      const updatedScore = isCorrect ? state.score + 1 : state.score;

      return {
        selectedOption: option,
        feedback: isCorrect ? "✅ Correct!" : "❌ Incorrect!",

        detailedSolution: currentQuestion.detailed_solution,
        score: updatedScore,
      };
    });
  },

  nextQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex + 1 < state.questions.length) {
        return {
          currentQuestionIndex: state.currentQuestionIndex + 1,
          feedback: null,
          detailedSolution: null,
          selectedOption: null,
        };
      } else {
        return { quizCompleted: true };
      }
    });
  },
}));
