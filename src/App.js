import './App.css';
import React from 'react'
import * as mi from '@magenta/image'

function App() {

  // step says wich step the user is on, 
  // 0: loading model, 1: input step, 2: output step
  const [step, setStep] = React.useState(0)
  const [model, setModel] = React.useState(null)

  const loadModel = async () => {
    // setTimeout(() => {
    //   setStep(1)
    // }, 3000);

    const model =  mi.ArbitraryStyleTransferNetwork();
    setModel(model)

    setStep(1)
  }

  const styleImage = async () => {
    setStep(2)
  }

  const reset = async () => {
    setStep(1)
  }

  const buttonFunction = {
    0 : {text: 'Load Model', func: loadModel},
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
