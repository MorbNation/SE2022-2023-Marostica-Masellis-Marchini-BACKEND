import { reactive, ref } from "vue";

const HOST = import.meta.env.VITE_API_HOST || `https://epiopera-4f1c76fdd577.herokuapp.com`;
const API_URL = HOST + '/api';

const postComments = reactive([]);
const commentsOK = ref('');
const commEdit = ref('');
const commento = ref('');

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

async function voteComment(valutazione, commId) {
    let voteData = {
        id: commId,
        valutazione: valutazione
    }

    try {
        const res = await (fetch(API_URL + '/commento_post/valuta', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(voteData),
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

async function segnalaCommento(commId) {
    let flagBody = {
        id: commId
    }

    try {
        const res = await (fetch(API_URL + '/commento_post/segnala', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(flagBody),
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

async function deleteCommento(commId) {
    try {
        const res = await (fetch(API_URL + '/commento_post/' + commId, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
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

async function editCommento(commId) {
    let editBody = {
        id: commId,
        testo: commEdit.value
    }

    try {
        const res = await (fetch(API_URL + '/commento_post/modifica', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(editBody),
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
    postComments,
    commentsOK,
    commEdit,
    commento,

    addComment,
    fetchCommentsByPost,
    voteComment,
    segnalaCommento,
    deleteCommento,
    editCommento
}
