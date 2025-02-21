module.exports = function(bot, followInterval, clearFollowInterval) {
    if (followInterval) {
      clearInterval(followInterval);
      clearFollowInterval();
      bot.setControlState('forward', false);
      console.log('Stopped following');
    } else {
      console.log('Not currently following anyone');
    }
  };