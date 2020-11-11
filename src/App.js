import './App.css';
import React from 'react'
import * as mi from '@magenta/image'

function App() {

  // step says wich step the user is on, 
  // 0: loading model, 1: input step, 2: output step
  const [step, setStep] = React.useState(0)
  const [model, setModel] = React.useState(null)
  const [contentImageUrl, setContentImageUrl] = React.useState(null)
  const [showContentImage, setShowContentImage] = React.useState(false)

  // aux functions
  const handleUpload = Event => {
    const img = Event.target.files[0]

    if (img != null) {
      const url = URL.createObjectURL(img)
      setContentImageUrl(url)
      setShowContentImage(true)
    }
  }

  // State machine on site functions
  const loadModel = async () => {
    // (step 0) first state, load model in the browser

    // setTimeout(() => {
    //   setStep(1)
    // }, 3000);

    const model =  mi.ArbitraryStyleTransferNetwork();
    setModel(model)

    setStep(1)
  }

  const styleImage = async () => {
    // (step 1) second state, page to set content and style images

    setStep(2)
    setShowContentImage(false) // dont show image preview after button press
  }

  const reset = async () => {
    // (step 2) third state, show model output and can go back to second state
    setStep(1)
  }

  // button actions to swap through states
  const buttonFunction = {
    0 : {text: 'Load Model', func: loadModel},
    1 : {text: 'Style Image', func: styleImage},
    2 : {text: 'New Style Transfer', func: reset}
  }

  return (
    <div className="App">
      {step === 1 && <input type='file' accept='image/*' onChange={handleUpload}/>}
      {showContentImage === true && <img src={contentImageUrl} alt="upload-preview" />}

      <button onClick={buttonFunction[step].func}>{buttonFunction[step].text}</button>
    </div>
  );
}

export default App;
