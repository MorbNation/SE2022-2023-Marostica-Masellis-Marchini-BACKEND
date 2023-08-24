import { reactive, ref } from "vue";
import { postComments } from "./post_comment";

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080` || 'https://epiopera-5f590f42a6df.herokuapp.com/';
const API_URL = HOST + '/api';

const profileComments = reactive([]);
const pcommentsOK = ref('');
const pcommEdit = ref('');
const pcommEditTitle = ref('');
const pcommento = ref('');
const ptitolo = ref('');

async function fetchPCommentsByUser(username) {
    let commenti = [];
    profileComments.splice(0);

    try {
        const res = await (fetch(API_URL + '/commento_profilo/all/' + username, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        }));

        if(!res.ok) {
            const data = await res.json();
            pcommentsOK.value = data.Error || "Something went wrong";
            commenti = [];
        } else {
            commenti = await res.json(); 
        }
    } catch (err) {
        pcommentsOK.value = "Network error";
        console.log(err);
        commenti = [];
    }

    for(const commento of commenti) {
        console.log("fetching comment " + commento);
        try {
            const res = await (fetch(API_URL + '/commento_profilo/' + commento, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            }));

            if(!res.ok) {
                const data = await res.json();
                profileComments.push({ testo: data.Error || "Something went wrong" });
                console.log(data.Error);
            } else {
                profileComments.push(await res.json());
            }
        } catch (err) {
            postComments.push({ testo: "Network error" });
            console.log(err);
        }
    }
}

async function addPComment(username) {
    let commBody = {
        profilo_commentato: username,
        titolo: ptitolo.value,
        testo: pcommento.value
    }

    pcommento.value = '';

    try {
        const res = await (fetch(API_URL + '/commento_profilo', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(commBody),
            credentials: 'include'
        }));

        if(!res.ok) {
            const data = await res.json();
            console.log(res);
            window.alert(data.Error || "Something went wrong");
        } else {
            console.log(res);
        }
    } catch (err) {
        window.alert("Network error");
        console.log(err);
    }
}

async function votePComment(valutazione, commId) {
    let voteData = {
        id: commId,
        valutazione: valutazione
    }

    try {
        const res = await (fetch(API_URL + '/commento_profilo/valuta', {
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

async function segnalaPCommento(commId) {
    let flagBody = {
        id: commId
    }

    try {
        const res = await (fetch(API_URL + '/commento_profilo/segnala', {
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
        window.alert("Netwrok error");
        console.log(err);
    }
}

async function deletePCommento(commId) {
    try {
        const res = await (fetch(API_URL + '/commento_profilo/' + commId, {
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

async function editPCommento(commId) {
    let editBody = {
        id: commId,
        titolo: pcommEditTitle.value,
        testo: pcommEdit.value
    }

    try {
        const res = await (fetch(API_URL + '/commento_profilo/modifica', {
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
    profileComments,
    pcommentsOK,
    pcommEdit,
    pcommento,
    ptitolo,
    pcommEditTitle,

    addPComment,
    fetchPCommentsByUser,
    votePComment,
    segnalaPCommento,
    deletePCommento,
    editPCommento
}