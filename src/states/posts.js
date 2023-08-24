import { reactive, ref } from 'vue'
import { loggedUser } from './user';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080` || 'https://epiopera-5f590f42a6df.herokuapp.com/';
const API_URL = HOST + '/api';

const posts = reactive([]);
const postsByUser = reactive([]);
const favoriti = reactive([]);

const titolo = ref('');
const testo = ref('');
const tag = ref('');
const editOK = ref('');
const favoritiOK = ref('');

async function editPost(postId, media) {
    let editBody = {
        id: postId,
        titolo: titolo.value,
        testo: testo.value,
        tag: tag.value.split(" "),
        media: media
    };

    try {
        const response = await fetch(API_URL + '/post/modifica', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(editBody),
            credentials: 'include'
        });

        if(response.ok) {
            editOK.value = 'Success';
            fetchPostsByUser();
        } else {
            const data = await response.json();
            editOK.value = data.Error || "Something went wrong";
        }
    } catch (err) {
        editOK.value = "Network error";
        console.log(err);
    }
}

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

async function segnala (postId) {
    const flagData = {
        id: postId
    }

    try {
        const response = await (fetch(API_URL + '/post/segnala', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(flagData),
            credentials: 'include'
        }));

        if(!response.ok) {
            const data = await response.json();
            window.alert(data.Error || "Something went wrong");
        } else {
            console.log(await response.json());
        }
    } catch (err) {
        window.alert("Something went wrong");
        console.log(err);
    }
}

async function fetchFavoriti(postsArray) {
    console.log(postsArray);
    favoriti.splice(0);

    for (const post of postsArray) {
        try {
            const res = await (fetch(API_URL + '/post/id/' + post, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            }));

            if(!res.ok) {
                const data = await res.json();
                favoritiOK.value = data.Error || "Something went wrong";
                console.log(data.Error);
            } else {
                favoriti.push(await res.json());
            }
        } catch (err) {
            favoriti.push({ titolo: "Netwrok error" });
            console.log(err);
        }
    }
}

async function savePost(postId) {
    let saveBody = {
        id: postId
    }

    try {
        const res = await (fetch(API_URL + '/post/salvaNeiFavoriti', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(saveBody),
            credentials: 'include'
        }));

        if(!res.ok) {
            const data = await res.json();
            window.alert(data.Error || "Something went wrong");
        } else {
            console.log(res);
        }
    } catch (err) {
        window.alert("Network error");
        console.log(err);
    }
}

export {
    posts,
    postsByUser,
    editOK,
    titolo,
    testo,
    tag,
    favoriti,
    favoritiOK,

    fetchPosts,
    fetchPostsByUser,
    vote,
    editPost,
    segnala,
    fetchFavoriti,
    savePost
}