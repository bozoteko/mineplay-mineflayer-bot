module.exports = function(bot, args) {
    const mathProblem = args.slice(1).join(' ');
    if (mathProblem) {
      try {
        const result = eval(mathProblem); // Use eval to calculate the result
        bot.chat(`The result is: ${result}`);
      } catch (e) {
        bot.chat('Invalid math problem!');
      }
    }
  };
  