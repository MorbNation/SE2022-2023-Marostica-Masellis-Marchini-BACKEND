import { reactive, ref } from "vue";
import { postComments } from "./post_comment";

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const profileComments = reactive([]);
const pcommentsOK = ref('');
const pcommEdit = ref('');

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

export {
    profileComments,
    pcommentsOK,
    pcommEdit,

    fetchPCommentsByUser
}