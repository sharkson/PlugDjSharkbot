var config = require('config');
var Request = require("request");

import { Chat } from './models/chat.model';
import { ChatRequest } from './models/chat-request.model';
import { ResponseRequest } from './models/response-request.model';

export class ChatService {
    update(msg: string, userName: string, conversationName: string, botName: string) {
        return new Promise(function (resolve, reject) {
            var chat = new Chat(botName, msg, userName, Date.now().toString());
            var chatRequest = new ChatRequest(chat, 'plugdj', conversationName, [], [], []);
            var requestBody = JSON.stringify(chatRequest);

            Request.put({
                "rejectUnauthorized": false,
                "headers": { "content-type": "application/json" },
                "url": config.get('api') + "/api/chatupdate",
                "body": requestBody
            }, (error, response, body) => {
                if (error) {
                    console.log(error);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }

    getResponse(conversationName: string) {
        return new Promise(function (resolve, reject) {
            var chatRequest = new ResponseRequest('plugdj', conversationName, [], [], []);
            var requestBody = JSON.stringify(chatRequest);

            Request.put({
                "rejectUnauthorized": false,
                "headers": { "content-type": "application/json" },
                "url": config.get('api') + "/api/response",
                "body": requestBody
            }, (error, response, body) => {
                if (error) {
                    console.log(error);
                    resolve(null);
                }
                resolve(JSON.parse(body));
            });
        });
    }
}
