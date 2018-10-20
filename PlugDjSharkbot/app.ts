const PlugAPI = require('plugapi');
var config = require('config');
import { ChatService } from './chat.service';

var chatService = new ChatService();

var conversationName = 'plugdj-' + config.get('room') + "-" + Date.now();

async function readMessage(data) {
    console.log(data.from + ': ' + data.message);
    if (data.message && data.from && data.from.username) {
        var updated = await chatService.update(data.message, data.from.username, conversationName);
        if (updated && shouldRespond(data)) {
            var response = await chatService.getResponse(conversationName);
            useResponse(response);
        }
    }
}

function shouldRespond(data) {
    if (data.from.username == bot.getSelf().username) {
        return false;
    }
    return true;
}

function useResponse(response) {
    if (response.confidence > config.get('bot.confidenceThreshold')) {
        var typeTime = 0;
        response.response.forEach(function (chat) {
            typeTime += getTypeTime(chat);
            setTimeout(function () {
                bot.sendChat(chat);
            }, typeTime);
        });
    }
}

function getTypeTime(message) {
    return message.length * 80;
}

const bot = new PlugAPI({
    email: config.get('login.email'),
    password: config.get('login.password')
});

bot.connect(config.get('room'));

bot.on(PlugAPI.events.ROOM_JOIN, (room) => {
    console.log('Joined ${room}');
});

bot.on(PlugAPI.events.CHAT, (data) => {
    readMessage(data);
});