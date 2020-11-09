import './App.css';
import React from 'react'

function App() {

  // step says wich step the user is on, 
  // 0: loading model, 1: input step, 2: output step
  const [step, setStep] = React.useState(0)

  const loadModel = async () => {
    setTimeout(() => {
      setStep(1)
    }, 3000);
  }

  const styleImage = async () => {
    setStep(2)
  }

  const reset = async () => {
    setStep(1)
  }

  loadModel()
  const buttonFunction = {
    0 : {text: 'Loading Model ...', func: () => {}},
    1 : {text: 'Style Image', func: styleImage},
    2 : {text: 'New Style Transfer', func: reset}
  }

  return (
    <div className="App">
      <button onClick={buttonFunction[step].func}>{buttonFunction[step].text}</button>
    </div>
  );
}

export default App;
