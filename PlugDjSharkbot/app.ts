const PlugAPI = require('plugapi');
var config = require('config');
import { ChatService } from './chat.service';

var chatService = new ChatService();

new PlugAPI({
    email: config.get('login.email'),
    password: config.get('login.password')
}, (err, bot) => {
    if (!err) {
        bot.connect(config.get('room'));

        bot.on(PlugAPI.events.ROOM_JOIN, (room) => {
            console.log('Joined ${room}');
        });

        bot.on(PlugAPI.events.CHAT, (data) => {
            console.log(data.from + ': ' + data.message);
            if (data.message && data.from && data.from.username) {
                chatService.update(data.message, data.from.username);
            }            
        });
    } else {
        console.log(`Error initializing plugAPI: ${err}`);
    }
});