const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

// Function to create a bot
function createBot(host, sessionData = null) {
  // If session data exists, pass it to the bot to reuse the session (authentication).
  const botOptions = {
    host: host,
    username: 'shenanigansfivem@gmail.com', // Microsoft account email
    auth: 'microsoft', // Use Microsoft authentication
    version: '1.21.1', // Specify Minecraft version
    ...(sessionData ? { session: sessionData } : {}), // Reuse session if available
  };

  const bot = mineflayer.createBot(botOptions);

  // Store the join dates in a JSON file
  let joinDates = {};
  const joinDatesFile = path.join(__dirname, 'joindates.json');

  // Load the join dates from the file
  if (fs.existsSync(joinDatesFile)) {
    try {
      joinDates = JSON.parse(fs.readFileSync(joinDatesFile, 'utf-8'));
    } catch (error) {
      console.error("Error loading joindates.json:", error);
    }
  }

  // Track current server
  let currentServer = 'hub'; // Default to 'hub'

  // Define followInterval here to be shared
  let followInterval = null;

  // Track whether the bot is already returning to the hub
  let isReturningToHub = false;

  // Import command handlers
  const help = require('./commands/help');
  const joindate = require('./commands/joindate');
  const stick = require('./commands/stick');
  const unstick = require('./commands/unstick');
  const solve = require('./commands/solve');
  const server = require('./commands/server');
  const hub = require('./commands/hub');
  const stats = require('./commands/stats');

  // Event listener for when the bot spawns (to track the hub status)
  bot.on('spawn', () => {
    console.log(`Bot has spawned successfully on ${host}!`);
    currentServer = 'hub'; // When the bot spawns in the hub
    isReturningToHub = false; // Reset the flag when the bot spawns
  });

  // Event listener for messages in chat
  bot.on('chat', (username, message) => {
    console.log(`Received message from ${username}: ${message}`); // Log all messages
    const args = message.split(' ');

    try {
      // Handle commands
      if (args[0] === '-help') help(bot);
      if (args[0] === '-joindate') joindate(bot, args, joinDates, joinDatesFile);
      if (args[0] === '-stick') stick(bot, args, (interval) => { followInterval = interval }); // Pass setter function
      if (args[0] === '-unstick') unstick(bot, followInterval, () => { followInterval = null }); // Pass followInterval and setter function
      if (args[0] === '-solve') solve(bot, args);
      if (args[0] === '-server') server(bot, args, createBot); // Pass createBot to the server module
      if (args[0] === '-stats') stats(bot);
      if (args[0] === '-hub' && !isReturningToHub) {
        console.log('Detected -hub command. Executing hub logic...');
        isReturningToHub = true; // Set the flag to prevent infinite loops
        hub(bot, createBot); // Pass bot and createBot to the hub module
      }
    } catch (error) {
      console.error('Error handling command:', error);
    }
  });

  // Event listener for players joining
  bot.on('playerJoined', (player) => {
    if (!joinDates[player.username]) {
      const joinDate = new Date();
      joinDates[player.username] = joinDate.toISOString();
      fs.writeFileSync(joinDatesFile, JSON.stringify(joinDates, null, 2));
      console.log(`Stored join date for ${player.username}`);
    }
  });

  // Handle errors
  bot.on('error', (err) => {
    console.error('Error occurred:', err);
  });

  bot.on('end', () => {
    console.log('Bot has disconnected from the server.');
    isReturningToHub = false; // Reset the flag when the bot disconnects
    setTimeout(() => {
      createBot('mc.mineplay.nl'); // Reconnect after a 5-second delay
    }, 5000);
  });

  bot.on('kicked', (reason) => {
    console.log(`Bot was kicked from ${host}:`, reason);
    if (reason.text && reason.text.includes("You are logging in too fast")) {
      console.log("Rate limit hit, waiting before retrying...");
      return; // Skip reconnecting immediately
    }

    console.log('Reconnecting to the hub...');
    bot.quit(); // Disconnect from the current server

    // Add a delay before reconnecting to avoid rate limit issues
    setTimeout(() => {
      createBot('mc.mineplay.nl'); // Reconnect to the hub after a delay
    }, 5000); // Wait 5 seconds before reconnecting
  });

  // Return the bot instance
  return bot;
}

// Start the bot on the hub server
createBot('mc.mineplay.nl');
