import { reactive } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080/`;
const API_URL = HOST + '/api';

const user = reactive ([]);

async function fetchUser(username) {
    user.values = await (await fetch(API_URL + '/utente'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_utente: username })
    }).json();
};

export { user, fetchUser };
