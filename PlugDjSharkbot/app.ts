﻿const PlugAPI = require('plugapi');
var config = require('config');
import { ChatService } from './chat.service';

var chatService = new ChatService();

var conversationName = 'plugdj-' + config.get('room') + "-" + Date.now();

async function readMessage(data) {
    console.log(data.from + ': ' + data.message);
    if (!ignoreMessage(data)) {
        var updated = await chatService.update(data.message, data.from.username, conversationName, bot.getSelf().username);
        if (updated && data.from.username != bot.getSelf().username) {
            var response = await chatService.getResponse(conversationName);
            if (shouldRespond(response, data)) {
                useResponse(response);
            }         
        }
    }
}

function ignoreMessage(data) {
    if (data.message && data.from && data.from.username) {
        if (config.get('bot.ignoreUsers').includes(data.from.username)) {
            return true;
        }
        return false;
    }
    return true;
}

function shouldRespond(response, data) {
    if (response.confidence > config.get('bot.confidenceThreshold')) {
        return true;
    }

    if (data.message.includes(bot.getSelf().username)) {
        return true;
    }

    var shouldRespond = false;
    config.get('bot.nickNames').forEach(function (nickName) {
        if (data.message.includes(nickName)) {
            shouldRespond = true;
        }
    });

    return shouldRespond;
}

function useResponse(response) {
    var typeTime = 0;
    response.response.forEach(function (chat) {
        typeTime += getTypeTime(chat);
        setTimeout(function () {
            bot.sendChat(chat);
        }, typeTime);
    });
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