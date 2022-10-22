import React from "react";
import { useState, useEffect } from "react";
import './App.css';
import Quiz from "./components/Quiz";

const AMOUNT = 5;
function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [type, setType] = useState('quiz'); // quiz or answer
  const [answerList, setAnswerList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect( () => {
    if (answerList.length === 0) {
      let list = [];
      for (let i = 0; i < AMOUNT; i++) {
        list.push(Math.floor(Math.random() * 4));
      }
      setAnswerList(prev => list);
      setSelectedList(prev => new Array(AMOUNT).fill(-1));
    }
    if (!isStarted) {
      fetch(`https://opentdb.com/api.php?amount=${AMOUNT}&type=multiple`)
        .then (res => res.json())
        .then (data => setQuizData(data.results));
    }
  }, [isStarted]);

  function startQuiz() {
    setIsStarted (prevValue => !prevValue);
  }


  const quizElements = quizData.map((quiz, i) => 
      <Quiz key={i}
        id = {i}
        question = {quiz.question} 
        options = {getOptions(quiz, i)}
        answer = {answerList[i]}
        clickAnswer = {clickAnswer}
        type="quiz"
      />
    )

  const answerElements = quizData.map((quiz, i) => 
      <Quiz key={i}
        id = {i}
        question = {quiz.question} 
        options = {getOptions(quiz, i)}
        answer = {answerList[i]}
        select = {selectedList[i]}
        clickAnswer = {clickAnswer}
        type="answer"
      />
  )


  function getOptions(data, questionNum) {
    let options = [];
    for (let i = 0; i < data.incorrect_answers.length; i++) {
      if (answerList[questionNum] === i) {
        options.push(data.correct_answer);
       } 
       options.push(data.incorrect_answers[i]);
    }
    if (answerList[questionNum] === data.incorrect_answers.length) {
      options.push(data.correct_answer);
    }
    //console.log(options)
    return options;
  }

  function clickAnswer(id, value) {
    const temp = [...selectedList];
    temp[id] = value;
    setSelectedList(prev => temp);
  } 
  
  function checkAnswer() {
    if (type === 'quiz') {
      setType("answer")
    } else {
      //initialize
      setIsStarted(false);
      setAnswerList([]);
      setType("quiz")
    }
  }

  function getCorrectNum() {
    let num = 0;
    selectedList.forEach((item, i) => {
      item === answerList[i] && num++ 
    })
    return num;
  }

  return (
    <div className="App">

      <div className="bg-screen">
        <div className="bg-float top-right"></div>

        {isStarted === false ? 
          <div className={`init-container flex-all-center`}>
            <h1>Quizzical</h1>
            <h4>Take 5 Quizzes, and get some wired!</h4>
            <button className="start-btn" onClick={startQuiz}>Start quiz</button>
          </div>
        :
          <div className="quiz-container">
            
            {type === 'quiz' ? quizElements : answerElements}
            {type==='answer' && <p>You scored {getCorrectNum()}/5 correct answers</p>}
            <button className="quiz-btn" onClick={checkAnswer}>
              {type === 'quiz' ? 'Check answers' : 'Play again'}</button>
          </div> 
        }
        <div className="bg-float bottom-left"></div>  
      </div>
      
    </div>
  );
}

export default App;
