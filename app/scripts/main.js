// todo: credit pixabay
// protect api key
// UI controls
// prompt to allow talking...
// refactor

let APP = {
  currentWord: "",
  newWordFrequency: 2, // in seconds
  lastTimeStamp: 0,
  drunkeness: .8 // 0-1, reflects confidence of word recognizer
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

    // Load new text
    $('#word').text(word);
    // Position text
    $('#word').css({
      top: Math.random() * ($(document).height() - 200),
      left: Math.random() * ($(document).width() - $('#word').width()),
    });

    // Preload image to avoid slow loading of pics
    const imgUrl = data.hits[0].webformatURL;

    $("#img-preloader").attr('src', imgUrl).on('load', () => {
      // Load bg
      $('body').css('background-image', 'url(' + imgUrl + ')');
    });
  });
};

const chooseWord = (phrase) => {
  let word = phrase.split(' ').pop();
  if (word !== APP.currentWord && word.length > 3) {
    APP.currentWord = word;
    updateWord(word);
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
      let phrase = event.results[event.resultIndex][0];
      if (
        phrase.confidence > APP.drunkeness
        && (event.timeStamp - APP.lastTimeStamp) > (APP.newWordFrequency * 1000)
      ) {
        APP.lastTimeStamp = event.timeStamp;
        chooseWord(phrase.transcript);
      }
    }
  }
}

initSpeechRecognition();
