const streamWords = (chunk) => {
  const lastWord = chunk.slice(chunk.lastIndexOf(" ") + 1);
}

if (annyang) {
  // Let's define a command.
  var commands = {
    '*chunk': streamWords
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start();
}
