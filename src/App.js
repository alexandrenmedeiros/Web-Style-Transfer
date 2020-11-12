import './App.css';
import React from 'react'
import Select from 'react-select'
import * as mi from '@magenta/image'

function resizeImageUrl(img_file, setUrl, max_ax=1200) {
  // function that resize an image file using a FileReader and a canvas
  // it returns the canvas url

  var img = document.createElement('img')
  var reader = new FileReader()

  img.onload = function() {
    var canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height

    if (this.height > max_ax || this.width > max_ax) {
      const biggest_ax = Math.max(this.width, this.height)

      canvas.width = this.width * (max_ax / biggest_ax)
      canvas.height = this.height * (max_ax / biggest_ax)
    }

    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

    const url = canvas.toDataURL();
    setUrl(url)
  }
    
  // function to specify what the reader will do when loading the image
  reader.onload = function(e) {
    img.src = e.target.result
  }

  reader.readAsDataURL(img_file)
}

function App() {

  // step says wich step the user is on, 
  // 0: loading model, 1: input step, 2: output step
  const [step, setStep] = React.useState(0)
  const [model, setModel] = React.useState(null)
  const [contentImageUrl, setContentImageUrl] = React.useState(null)
  const [showContentImage, setShowContentImage] = React.useState(false)
  const [styleImageUrl, setStyleImageUrl] = React.useState(null)
  const [showStyleImage, setShowStyleImage] = React.useState(false)
  // const [outputImageUrl, setOutputImageUrl] = React.useState(null)
  // const [showOutputImage, setShowOutputImage] = React.useState(false)

  const styleOptions = [
    {label: 'kanagawa_great_wave', value: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Great_Wave_off_Kanagawa.jpg'},
    {label: 'kandinsky_composition_7', value: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg'},
    {label: 'van_gogh_starry_night', value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'},
    {label: 'turner_nantes', value: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/JMW_Turner_-_Nantes_from_the_Ile_Feydeau.jpg'},
    {label: 'munch_scream', value: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg'},
    {label: 'picasso_demoiselles_avignon', value: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Les_Demoiselles_d%27Avignon.jpg'},
    {label: 'picasso_violin', value: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Pablo_Picasso%2C_1911-12%2C_Violon_%28Violin%29%2C_oil_on_canvas%2C_Kr%C3%B6ller-M%C3%BCller_Museum%2C_Otterlo%2C_Netherlands.jpg'},
    {label: 'picasso_bottle_of_rum', value: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Pablo_Picasso%2C_1911%2C_Still_Life_with_a_Bottle_of_Rum%2C_oil_on_canvas%2C_61.3_x_50.5_cm%2C_Metropolitan_Museum_of_Art%2C_New_York.jpg'},
    {label: 'fire', value: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_bonfire.jpg'},
    {label: 'derkovits_woman_head', value: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Derkovits_Gyula_Woman_head_1922.jpg'},
    {label: 'amadeo_style_life', value: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Untitled_%28Still_life%29_%281913%29_-_Amadeo_Souza-Cardoso_%281887-1918%29_%2817385824283%29.jpg'},
    {label: 'derkovtis_talig', value: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Derkovits_Gyula_Talig%C3%A1s_1920.jpg'},
    {label: 'amadeo_cardoso', value: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Amadeo_de_Souza-Cardoso%2C_1915_-_Landscape_with_black_figure.jpg'}
  ]

  // handle functions
  const handleUpload = Event => {
    const img = Event.target.files[0]

    if (img != null) {

      resizeImageUrl(img, setContentImageUrl, 600)
      setShowContentImage(true)
    }
  }

  const handleStyleSelect = selectedStyleOption => {
    if(selectedStyleOption != null) {
      fetch(selectedStyleOption.value)
        .then(response => response.blob())
        .then(img =>{
          resizeImageUrl(img, setStyleImageUrl, 256)
          setShowStyleImage(true)
        })
    }
  }

  // State machine functions (On transitions)
  const loadModel = async () => {
    // (step 0) first state, load model in the browser

    const model =  mi.ArbitraryStyleTransferNetwork();
    setModel(model)

    setStep(1)
  }

  const styleImage = async () => {
    // (step 1) second state, page to set content and style images
    // if (contentImageUrl != null && styleImageUrl != null) {
      
    // }

    setShowContentImage(false) // dont show image preview after button press
    setShowStyleImage(false) // dont show image preview after button press
    setStep(2)
  }

  const reset = async () => {
    // (step 2) third state, show model output and can go back to second state

    setContentImageUrl(null)
    setStyleImageUrl(null)
    setStep(1)
  }

  // button actions to swap through states
  const buttonFunction = {
    0 : {text: 'Load Model', func: loadModel},
    1 : {text: 'Style Image', func: styleImage},
    2 : {text: 'New Style Transfer', func: reset}
  }

  // State machine output (On state)
  return (
    <div className="App">
      {step === 1 && <input type='file' accept='image/*' onChange={handleUpload}/>}
      {showContentImage === true && <img src={contentImageUrl} alt="upload-preview" />}

      {step === 1 && <Select options={styleOptions} onChange={handleStyleSelect} />}
      {showStyleImage === true && <img src={styleImageUrl} alt="upload-preview" />}

      <button onClick={buttonFunction[step].func}>{buttonFunction[step].text}</button>
    </div>
  );
}

export default App;
