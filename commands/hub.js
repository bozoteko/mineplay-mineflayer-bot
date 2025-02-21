module.exports = function(bot, createBot) {
    const hubCommand = `/hub`; // Use /hub to return to the hub
    console.log('Attempting to return to hub...');

    // Send the hub command
    bot.chat(hubCommand);

    // Log the command and handle potential errors
    bot.once('message', (message) => {
      const msg = message.toString();
      if (msg.includes('Connecting you to')) {
        console.log('Successfully sent hub command. Returning to hub...');
      } else if (msg.includes('Unknown command')) {
        console.error('Error: The /hub command is not recognized. Ensure the server supports it.');
      } else if (msg.includes('Cannot join')) {
        console.error('Error: Unable to join the hub. Check server availability.');
      } else {
        console.log('Received message:', msg);
      }
    });

    // Handle errors during the switch
    bot.once('kicked', (reason) => {
      console.error('Bot was kicked while trying to return to hub:', reason);
      console.log('Attempting to reconnect to hub...');
      bot.quit(); // Disconnect from the current server
      setTimeout(() => {
        createBot('mc.mineplay.nl'); // Reconnect to the hub
      }, 5000); // Wait 5 seconds before reconnecting
    });

    // Handle disconnections
    bot.once('end', () => {
      console.log('Bot disconnected while trying to return to hub. Reconnecting...');
      setTimeout(() => {
        createBot('mc.mineplay.nl'); // Reconnect after 5 seconds
      }, 5000); // Wait 5 seconds before reconnecting
    });
};
