module.exports = function(bot, args, joinDates, joinDatesFile) {
    const username = args[1];
    if (username && joinDates[username]) {
        const joinDate = new Date(joinDates[username]);
        // Convert the timestamp to AEDT
        const formattedDate = joinDate.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });

        bot.chat(`I first saw ${username} join on ${formattedDate} AEDT`);
        console.log(`Sent join date for ${username}: ${formattedDate} AEDT`);
    } else {
        bot.chat(`No join date found for ${username}`);
        console.log(`No join date found for ${username}`);
    }
};
