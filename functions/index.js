const functions = require('firebase-functions');
const express = require('express');
const requestPromise = require('request-promise-native');
const cors = require('cors');

// local
// http://localhost:5000/functions-c0ad3/us-central1/helloWorld
// deploy
// https://us-central1-functions-c0ad3.cloudfunctions.net/helloWorld

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express();

//全てのエンドポイント許可
// app.use(cors());

//APIにリクエストを送る関数を定義
const getDataFromApi = async keyword => {
    //cloud functionsから実行する場合地域設定が必要になる。　'country=JP'を追加
    const requestUrl = 'https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:';
    const result = await requestPromise(`${requestUrl}${keyword}`);
    return result;
}

app.get('/hello', (req, res) => {
    res.send('Hello Express!');
});

app.get('/user/:userId', (req, res) => {
    const users = [
        { id: 1, name: 'ジョナサン' },
        { id: 2, name: 'ジョセフ' },
        { id: 3, name: '承太郎' },
        { id: 4, name: '伏助' },
        { id: 5, name: 'ジョルノ' },
    ];
    const targetUser = users.find(user => user.id === Number(req.params.userId));
    res.send(targetUser);
});

//許可したいエンドポイントをしていする場合、第二引数に cors() を設定　
app.get('/gbooks/:keyword', cors(), async (req, res) => {
    const response = await getDataFromApi(req.params.keyword);
    res.send(response);
});

const api = functions.https.onRequest(app);
module.exports = { api };

// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });
