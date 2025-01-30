import { create } from "zustand";
import axios from "axios";

const API_URL = "https://api.jsonserve.com/Uw5CrX";

export const useQuizStore = create((set) => ({
    questions: [], // for storing the questions
    currentQuestionIndex: 0, // for tracking the current question index
    score: 0, // for tracking the score
    loading: false, // for tracking the loading state
    feedback: null, // for storing the feedback
    detailedSolution: null, // for storing the detailed solution
    quizCompleted: false, // for tracking the quiz completion

    fetchQuestions: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(
                "/api",
              );
            set({ questions: response.data.questions, loading: false });
            console.log("Questions fetched successfully!", response.data.questions);
        } catch (error) {
            console.error("Error fetching questions", error);
            set({ loading: false });
        }
    },

    selectOption: (option)=>{
        set((state)=>{
            const currentQuestion = state.questions[state.currentQuestionIndex];
            const isCorrect = option.is_correct;
            const updatedScore = isCorrect ? state.score + 1 : state.score;

            return {
                selectedOption: option,
                feedback: isCorrect ? "✅ Correct!" : "❌ Incorrect!",
                
                detailedSolution:currentQuestion.detailed_solution,
                score: updatedScore,
            };
        });
    },

    nextQuestion: ()=>{
        set((state)=>{
            if(state.currentQuestionIndex+1 < state.questions.length){
                return{
                    currentQuestionIndex: state.currentQuestionIndex+1,
                    feedback: null,
                    detailedSolution: null,
                    selectedOption: null,
                };
            }else{
                return { quizCompleted: true };
            }
        })
    }
}));
