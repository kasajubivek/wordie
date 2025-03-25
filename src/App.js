import './App.css';
import { useEffect, useState, useRef } from 'react';

function App() {
  const API_URL = 'https://random-word-api.herokuapp.com/word?length=5';
  // const magicWord = "react";
  const [magicWord, setMagicWord] = useState('');
  
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [colors, setColors] = useState(
    [...Array(6)].map(() => Array(5).fill('white'))
  );
  
  const [userGuess, setUserGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const myRef = useRef(false);

  
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setMagicWord(data[0]); 
        console.log(data[0]);//for demo purposes
      } catch (error) {
        console.error('Error fetching the word:', error);
      }
    };
    
    if(myRef.current === false){
      myRef.current = true;
      fetchWord();
    }
    
    
  }, []);
  


  useEffect(() => {
    if(!isGameOver && userGuess.length > 0){
      console.log("magic worddd",magicWord)
      const index = guesses.findIndex(guess => guess.length !== 5);
      const updatedGuessList = [...guesses];
      updatedGuessList[index] = userGuess;
      if(userGuess.length <= 5){
        setGuesses(updatedGuessList);
        if (typeof userGuess === 'string' && typeof magicWord === 'string') {
          if(userGuess.toLowerCase() === magicWord.toLowerCase()){
            setTimeout(() => {
              setIsGameOver(true);
              alert('Yayyyy, you got it!');
            }, 300);
            
          }
        }
      }
      if(userGuess.length >= 5){
        for(let i=0; i<userGuess.length;i++){
          const updatedColors = [...colors];
          if(userGuess[i] === magicWord[i]){
            updatedColors[index][i] = "#49ed49";
            setColors(updatedColors);
            console.log("Green: "+userGuess[i]);
          }else if(magicWord.includes(userGuess[i])){
            updatedColors[index][i] = "#ffa330";
            setColors(updatedColors);
            console.log("Yellow: "+userGuess[i]);
          }else{
            updatedColors[index][i] = "#c9c6c6";
            setColors(updatedColors);
          }
        }
        setUserGuess('');
      }
    }
    
    
  }, [userGuess]);

  const handleUserInput = (event) =>{
    if(!isGameOver){
      const key = event.key.toLowerCase();
      if (key === "backspace") {
        setUserGuess((prevGuess) => prevGuess.slice(0, -1));
      } else if (/[a-z]/i.test(key) && key.length === 1) {
        setUserGuess((userGuess) => userGuess + key);
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleUserInput);


    return () => {
      document.removeEventListener('keydown', handleUserInput);
    };
  }, []);



  return (
    <div className='board'>
      <h1>Wordie</h1>
      {guesses.map((guess, index) => {
        return <Line guess={guess} colors={colors[index]}/>
      })
      }
    </div>
  );
}

export default App;


function Line({guess, colors}) {
  const tiles = []

  for(let i=0; i<5;i++){
    tiles.push(<div key={i} className='tile' style={{backgroundColor: colors[i] || "white"}}>{guess[i]}</div>)
  }

  return (
    <div className='line'>{tiles}</div>
  )
}