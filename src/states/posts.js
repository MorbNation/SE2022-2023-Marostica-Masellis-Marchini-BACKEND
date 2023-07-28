import { reactive } from 'vue'
import { loggedUser } from './user';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const posts = reactive([]);
const postsByUser = reactive([]);

async function fetchPosts() {
    try {
        const response = await fetch(API_URL + '/posts', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        });

        if(!response.ok) {
            const data = await response.json();
            window.alert(data.Error || "Something went wrong");
        } else {
            posts.values = await response.json();
        }
    } catch (err) {
        window.alert("Network error");
        console.log(err);
    }
}

async function fetchPostsByUser() {
    if (loggedUser.username == undefined) {
        return;
    } else {
        try {
            const response = await fetch(API_URL + '/post/user/' + loggedUser.username, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                window.alert(data.Error || "Something went wrong");
                postsByUser.values = []; // Empty the userPosts.values in case of an error.
            } else {
                postsByUser.values = await response.json();
            }
        } catch (err) {
            window.alert("Network error");
            console.log(err);
            postsByUser.values = []; // Empty the userPosts.values in case of a network error.
        }
    }
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

export { posts, fetchPosts, vote, fetchPostsByUser, postsByUser };