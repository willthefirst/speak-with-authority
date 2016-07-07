// todo: credit pixabay
// protect api key

let APP = {
  currentWord: "",
  newWordFrequency: 3, // in seconds
  readyForNewWord: true
}

const waitBeforeNewWord = (freqInSeconds) => {
  // Prevent a new word from being added for newWordFrequency seconds
  APP.readyForNewWord = false;
  window.setTimeout(function() {
    APP.readyForNewWord = true;
  }, freqInSeconds * 1000)
}

const updateWord = (word) => {
  // Load new image
  $.getJSON('https://pixabay.com/api/',
  {
    key: '2878588-8aa2c9f34d071923f0c6b1582',
    q: word,
    per_page: 3,
  },
  (data) =>  {
    // Break when the API comes back empty
    if (data.totalHits === 0) {
      console.warn(`Couldn't find an image for '${word}'.`);
      return
    }

    // Update current work in app, restart frequency timer
    APP.currentWord = word;
    waitBeforeNewWord(APP.newWordFrequency);

    // Preload image to avoid slow loading of pics
    const imgUrl = data.hits[0].webformatURL;
    $("#img-preloader").attr('src', imgUrl).on('load', () => {
      // Load bg
      $('body').css('background-image', 'url(' + imgUrl + ')');
      // Load new text
      $('#word').text(word);
      // Position text
      $('#word').css({
        top: Math.random() * ($(document).height() - 200),
        left: Math.random() * ($(document).width() - $('#word').width()),
      });
    });
  }).fail((e) => {
    console.log(e.statusText, e.statusCode());
  })
};

const chooseWord = (transcript) => {
  // Strip out words shorter than two characters
  let words = [];
  transcript.split(' ').forEach(function(word) {
    if (word.length > 2 && word != APP.currentWord) {
      words.push(word)
    }
  });

  // If we have a useful collection of words, choose one randomly
  if (words.length) {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    console.log('Chosen', randomWord);
    updateWord(randomWord);
  }
}

const initSpeechRecognition = () => {
  // Check if Speech Recognition API is available
  if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support speech recognition. I would recommoned using the latest version of Google Chrome.');
    upgrade();
  } else {
    let recognition = new webkitSpeechRecognition;
    recognition.continuous = true; // Do not end stream
    recognition.interimResults = true; // Speeds up results
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
      let phrase = "";
      phrase = event.results[event.resultIndex][0];
      if (APP.readyForNewWord && phrase.confidence > .5) {
        chooseWord(phrase.transcript);
      }
    }


  }
}

initSpeechRecognition();
