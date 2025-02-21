module.exports = (bot, message) => {
  // Split the message to get coordinates (e.g., "-tp 100 65 100")
  const coords = message.split(' ').slice(1);

  if (coords.length === 3) {
    const [x, y, z] = coords.map(Number);

    // Check if the coordinates are valid numbers
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      bot.chat(`Teleporting to ${x}, ${y}, ${z}`);
      // Set position (teleport the bot)
      bot.entity.position.set(x, y, z);
    } else {
      bot.chat('Invalid coordinates! Please provide valid numbers for x, y, and z.');
    }
  } else {
    bot.chat('Please provide x, y, z coordinates for teleporting.');
  }
};
