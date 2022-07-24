import axios from "axios";
import React, { useState, useContext, useEffect } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
  vehicles: 28,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const url = "";
const tempUrl =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [error, setError] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });

  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios.get(url).catch((error) => console.log(error));

    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      }
    } else {
      setWaiting(true);
      setError(true);
    }
  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      let newIndex = oldIndex + 1;
      if (newIndex > questions.length - 1) {
        openModal();
        return 0;
      }
      return newIndex;
    });
  };

  const checkAnswer = (value) => {
    if (value) {
      setCorrectAnswers((oldState) => oldState + 1);
    }
    nextQuestion();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setWaiting(true);
    setCorrectAnswers(0);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setQuiz({ ...quiz, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;

    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correctAnswers,
        error,
        isModalOpen,
        quiz,
        nextQuestion,
        checkAnswer,
        closeModal,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
