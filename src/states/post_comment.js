import { reactive, ref } from "vue";

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const postComments = reactive([]);
const commentsOK = ref('');

async function fetchCommentsByPost(postId) {
    let commenti = [];
    postComments.splice(0); //Trickery per svuotare l'array che se non const non funziona

    try {
        const response = await (fetch(API_URL + '/commento_post/all/' + postId, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        }));

        if(!response.ok) {
            const data = await response.json();
            commentsOK.value = data.Error || "Something went wrong";
            commenti = [];
        } else {
            commenti = await response.json();
        }
    } catch (err) {
        commentsOK.value = "Network error";
        console.log(err);
        commenti = [];
    }

    for(const commento of commenti) {
        console.log("fetching post " + commento);
        try {
            const res = await(fetch(API_URL + '/commento_post/' + commento, {
                method: 'GET',
                headers: {
                    'Content-type': 'appliction/json'
                },
                credentials: 'include'
            }));

            if(!res.ok) {
                const data = await res.json();
                postComments.push({ testo: data.Error || "Something went wrong" });
                console.log(data.Error);
            } else {
                postComments.push(await res.json());
            }
        } catch (err) {
            postComments.push({ testo: "Network error" });
            console.log(err);
        }
    }
}

export {
    postComments,
    commentsOK,

    fetchCommentsByPost
}
