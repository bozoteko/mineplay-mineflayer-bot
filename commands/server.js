module.exports = function(bot, args, createBot) {
  const serverNumber = args[1];
  if (!isNaN(serverNumber)) {
    const serverCommand = `/server mineplay-${serverNumber}`;
    console.log(`Switching to server: mineplay-${serverNumber}`);

    // Send the server switch command
    bot.chat(serverCommand);

    // Listen for a response from the server
    const onMessage = (message) => {
      const msg = message.toString();
      if (msg.includes('Sending you to')) {
        console.log(`Successfully switched to server: mineplay-${serverNumber}`);
        bot.removeListener('message', onMessage); // Stop listening for messages
      } else if (msg.includes('Unknown command')) {
        console.error('Error: The /server command is not recognized. Ensure the server supports it.');
        bot.removeListener('message', onMessage); // Stop listening for messages
      } else if (msg.includes('Cannot join')) {
        console.error('Error: Unable to join the server. Check server availability.');
        bot.removeListener('message', onMessage); // Stop listening for messages
      }
    };

    bot.on('message', onMessage);

    // Handle errors during the switch
    const onKicked = (reason) => {
      console.error('Bot was kicked while trying to switch servers:', reason);
      console.log('Reconnecting to the hub...');
      bot.removeListener('kicked', onKicked); // Stop listening for kicks
      bot.quit(); // Disconnect from the current server
      setTimeout(() => {
        createBot('localhost:25575'); // Reconnect to the hub
      }, 2000); // Wait 2 seconds before reconnecting
    };

    bot.once('kicked', onKicked);

    // Handle disconnections
    const onEnd = () => {
      console.log('Bot disconnected while trying to switch servers. Reconnecting...');
      bot.removeListener('end', onEnd); // Stop listening for disconnections
      setTimeout(() => {
        createBot('localhost:25575'); // Reconnect to the hub
      }, 2000); // Wait 2 seconds before reconnecting
    };

    bot.once('end', onEnd);
  } else {
    console.log('Invalid server number provided.');
  }
};