module.exports = function(bot, args, setFollowInterval) {
    const username = args[1];
    if (username) {
        const target = bot.players[username]?.entity;
        if (target) {
            // Start following the player 2 blocks above their head (flying above)
            const interval = setInterval(() => {
                const targetPos = target.position;
                const aboveHeadPos = targetPos.offset(0, 2, 0); // 2 blocks above the target

                // Set the bot's position 2 blocks above the target and prevent it from falling
                bot.entity.position.set(aboveHeadPos.x, aboveHeadPos.y, aboveHeadPos.z);
                bot.entity.velocity.set(0, 0, 0); // Stop any falling

                // Keep bot facing the player
                bot.lookAt(target.position);
            }, 50); // Update every 50ms (faster movement update)

            setFollowInterval(interval); // Set the follow interval for future use
        } else {
            console.log(`Player ${username} not found`);
        }
    } else {
        console.log('Usage: -stick <username>');
    }
};
