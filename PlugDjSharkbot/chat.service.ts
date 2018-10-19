var config = require('config');
var Request = require("request");

import { Chat } from './models/chat.model';
import { ChatRequest } from './models/chat-request.model';

export class ChatService {
    conversationName = 'plugdj-' + config.get('room') + "-" + Date.now();

    update(msg: string, userName: string) {
        var chat = new Chat('sharkbot', msg, userName, Date.now().toString());
        var chatRequest = new ChatRequest(chat, 'plugdj', this.conversationName, [], [], []);
        var requestBody = JSON.stringify(chatRequest);

        Request.put({
            "rejectUnauthorized": false,
            "headers": { "content-type": "application/json" },
            "url": config.get('api') + "/api/chatupdate",
            "body": requestBody
        }, (error, response, body) => {
            if (error) {
                return console.log(error);
            }
            console.log(JSON.parse(body));
        });
    }
}

