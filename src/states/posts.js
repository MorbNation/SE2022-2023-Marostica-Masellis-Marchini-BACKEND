import { reactive } from 'vue'
import { loggedUser } from './login';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const posts = reactive([]);

async function fetchPosts() {
    posts.values = await (await fetch(API_URL + '/posts')).json();
}

async function vote(score, post) {
    console.log("id: " + post + "\nscore: " + score + "\ntoken: " + loggedUser.token);

    const voteData = {
        id: post,
        valutazione: score
    };

    await fetch(API_URL + '/post/valuta', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(voteData),
        credentials: 'include'
    })
    .then(res => {
        console.log(res.headers.get("set-cookie"));
    })
    .catch(err => {
        console.log(err);
    });
}

export { posts, fetchPosts, vote };