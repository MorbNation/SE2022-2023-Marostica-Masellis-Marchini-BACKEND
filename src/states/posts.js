import { reactive, ref } from 'vue'
import { loggedUser } from './user';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const posts = reactive([]);
const postsByUser = reactive([]);

const titolo = ref('');
const testo = ref('');
const tag = ref('');
const editOK = ref('');
const commento = ref('');

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

async function addComment(postId) {
    let commentBody = {
        id_post: postId,
        testo: commento.value,
    };

    commento.value = '';

    try {
        const response = await (fetch(API_URL + '/commento_post', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(commentBody),
            credentials: 'include'
        }));

        if(!response.ok) {
            const data = await response.json();
            console.log(response);
            window.alert(data.Error || "Something went wrong");
        } else {
            console.log(response);
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
    commento,

    fetchPosts,
    fetchPostsByUser,
    vote,
    editPost,
    segnala,
    addComment
}