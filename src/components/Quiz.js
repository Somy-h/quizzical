import React, { useEffect } from 'react';
import {useState} from 'react';

export default function Quiz(props) {
  const [selectedIdx, setSelectedIdx] = useState(-1);

  function clickAnswer(id, value) {
    setSelectedIdx (prev => value);
    console.dir(props.options);
    props.clickAnswer(id, value);
  }

  return (
    <div className="quiz-items flex-all-center">
      <h4>{props.question}</h4>
      <div className="btn-options">
      {
        (props.type === 'quiz') ?
          props.options.map((quizItem, i) =>
            <button 
              className={`answer-btn ${selectedIdx === i ? "selected" : ""}`}
              onClick={() => clickAnswer(props.id, i)}
            >{props.options[i]}
            </button> 
          )
        :  // check answer
          props.options.map((quizItem, i) =>
            <button 
              className=
                {`answer-btn 
                  ${ (props.answer === i) 
                  ? "answer" 
                  : (props.select === i && props.select !== props.answer) ? "incorrect": ""
                  }`
                }
              onClick={() => clickAnswer(props.id, i)}
            >{props.options[i]}
            </button>  
          )
      }
      </div> 
      <hr className="quiz-hr"></hr>
    </div>
  )
}