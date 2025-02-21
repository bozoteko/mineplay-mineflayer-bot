module.exports = function stats(bot) {
    const uptime = Math.floor(process.uptime()); // Get uptime in seconds
    const ping = bot.player ? bot.player.ping : 'N/A'; // Get bot ping

    // Get total players from tab list (shows all players on the network)
    const totalPlayers = Object.keys(bot.players).length;

    // Format and send a single-line response
    const statsMessage = `Bot Stats: Uptime: ${uptime}s | Ping: ${ping}ms | Players Online: ${totalPlayers}`;
    bot.chat(statsMessage);
};
