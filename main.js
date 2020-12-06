// import { ArticlesApp } from './app';


// let app = new ArticlesApp(document.querySelector('#app'));

// app.init();


import axios from 'axios';
import 'regenerator-runtime/runtime.js';
let currentToken = '';

const instance = axios.create({
    baseURL: '/js-ra-tokens-api/',
    timeout: 10000
});

instance.interceptors.request.use(addAuthToken);
instance.interceptors.request.use(packPostBody);

function addAuthToken(request) {
    request.headers.Authorization = currentToken;
    console.log('url', request.url);
    console.log('Проверяю токен', request.headers.Authorization);
    return request;
}

async function login() {
    let res = await instance.post('auth/login.php', { login: '2e263beca47758cbe4c1df851f4ecdab', password: '12345' });
    console.log('Получил access token:', res.data.accessToken);
    currentToken = res.data.accessToken;
    
    // вот тут всегда 401 ответ от сервера
    let check = await instance.get('auth/check.php');
    console.log(check);
}

function packPostBody(request) {
    if (request.method === 'post' && !(request.data instanceof FormData)) {
        let data = new FormData();

        for (let name in request.data) {
            data.append(name, request.data[name]);
        }
        request.data = data;
    }
    return request;
}

login();

