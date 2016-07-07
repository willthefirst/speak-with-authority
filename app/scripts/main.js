const getImageFromAPI = (term) => {
  $.getJSON('https://pixabay.com/api/',
  {
    key: '2878588-8aa2c9f34d071923f0c6b1582',
    q: term,
    per_page: 3,
  },
  function(data) {
    const imgUrl = data.hits[0].webformatURL
    $('body').css('background-image', 'url(' + imgUrl + ')');
  });
}

const updateWord = (word) => {
  $('#word').text(word);
}

const getLastWord = (chunk) => {
  const lastWord = chunk.slice(chunk.lastIndexOf(" ") + 1);
  getImageFromAPI(lastWord);
  updateWord(lastWord)
}

if (annyang) {
  // Let's define a command.
  var commands = {
    '*chunk': getLastWord
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start();
}
