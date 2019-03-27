/**
 * A Bot for Slack!
 */
const fs = require('fs');

const config = {
        json_file_store: './db_slack_bot_ci/',
    };

var quips = [];
fs.readFile('./quips.txt', 'utf8', function(err, contents) {
                              quips = contents.split('\n');
                          });

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN) {
    //Treat this as a custom integration
    const customIntegration = require('./lib/custom_integrations');
    const token = process.env.TOKEN;
    var controller = customIntegration.configure(token, config, (bot, installer) => {});
} else {
    console.log('Error: Must supply a TOKEN environment variable');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(['quip'], ['direct_mention'], function (bot, message) {
    if (quips) {
        const randomQuip = quips[Math.floor(Math.random() * quips.length)]
        bot.reply(message, randomQuip);
    } else {
        bot.reply(message, "The quips aren't coming, the quips just aren't coming.");
    }
});

controller.on('direct_message', function (bot, message) {
    bot.reply(message, 'Just like Jay Leno on NBC, I only quip on channels.');
});


/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});
