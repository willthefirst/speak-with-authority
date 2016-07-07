let APP = {
  currentWord: "",
  newWordFrequency: 1, // in seconds
  readyForNewWord: true
}

const waitBeforeNewWord = (freqInSeconds) => {
  // Prevent a new word from being added for newWordFrequency seconds
  APP.readyForNewWord = false;
  window.setTimeout(function() {
    APP.readyForNewWord = true;
  }, freqInSeconds * 1000)
}

const updateScreen = (word) => {
  // Load new image
  $.getJSON('https://pixabay.com/api/',
  {
    key: '2878588-8aa2c9f34d071923f0c6b1582',
    q: word,
    per_page: 3,
  },
  (data) =>  {
    const imgUrl = data.hits[0].webformatURL;
    // Preload image to avoid slow loading of pics
    $("#img-preloader").attr('src', imgUrl).on('load', () => {
      // Load bg
      $('body').css('background-image', 'url(' + imgUrl + ')');
      // Load new text
      $('#word').text(word);
    });
  })
}


const isConfident = (confidence) => {
  // console.log(transcript);
  if (
    APP.readyForNewWord
    && confidence > .01
  ) {
    return true
  }
  return false
}

const updateWord = (transcript) => {
  let words = transcript.split(' ');

  // Strip out words shorter than two characters
  words = words.map(function(curr) {
    if (curr.length > 2 && curr !== APP.currentWord) {
      return curr
    }
  });

  // Choose randomly
  let randomWord = words[Math.floor(Math.random() * words.length)];
  APP.currentWord = randomWord;
  updateScreen(randomWord);
  waitBeforeNewWord(APP.newWordFrequency);
}

const initSpeechRecognition = () => {
  // Check if Speech Recognition API is available
  if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support speech recognition. I would recommoned using the latest version of Google Chrome.');
    upgrade();
  } else {
    let recognition = new webkitSpeechRecognition;
    recognition.continuous = false; // Do not end stream
    recognition.interimResults = true; // Speeds up results

    // Called for every new grok of speech (determined by pauses)

    // resultIndex gets bumped every time isFinal becomes true
    recognition.onresult = function(event) {
      console.log(event)
      let phrase = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        phrase += event.results[i][0].transcript;
        // console.log(i, phrase);
        if (isConfident(event.results[i][0].confidence)) {
          updateWord(phrase.transcript);
        }
      }
    }

    recognition.lang = 'en-US';
    recognition.start();
  }
}

initSpeechRecognition();
