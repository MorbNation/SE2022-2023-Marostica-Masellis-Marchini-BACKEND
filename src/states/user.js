import { ref, reactive } from "vue";
import { fetchPostsByUser } from "./posts";

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const username = ref('Ilcalmissimo');  /* TODO: change to empty and set placeholder for both */
const password = ref('Cotoletta.123');
const userreg = ref('');
const pswreg = ref('');
const pswreg2 = ref('');
const email = ref('');

const warning = ref('');
const userObj = reactive([]);
const regOK = ref('');

async function fetchUser() {
    if(loggedUser.username == undefined) {
        return;
    } else {
        userObj.values = await (await fetch(API_URL + '/utente/' + loggedUser.username, { credentials: 'include' })).json();
    }
} 

function login() {
    fetch(API_URL + "/utente/login", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
    .then(async (res) => {
        if (res.ok) {
            const data = await res.json();
            setLoggedUser(data);
            // emit("login", loggedUser);
            document.cookie = `tokenEpiOpera=${data.token}`;
            warning.value = ''; // Clear the warning if the login is successful
        } else {
            const errorData = await res.json();
            warning.value = errorData.Error || 'Credentials are incorrect';
        }
    })
    .catch((error) => {
        warning.value = "Network error";
        console.log(error);
    });
};

function register() {
    if(pswreg.value !== pswreg2.value) {
        regOK.value = 'Password does not match';
        return;
    }

    let registrationBody = {
        username: userreg.value,
        email: email.value,
        password: pswreg.value,
        utenti_seguiti: [],
        post_favoriti: []
    };

    fetch(API_URL + '/utente', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(registrationBody),
        credentials: 'include'
    })
    .then(async (res) => {
        if(res.ok){
            const data = await res.json();
            setLoggedUser(data);
            // emit("login", loggedUser);
            document.cookie = `tokenEpiOpera=${data.token}`;
            regOK.value = '';
        } else {
            const errorData = await res.json();
            regOK.value = errorData.Error || "Something went wrong";
        }
    })
    .catch(err => {
        regOK.value = 'Network error';
        console.log(err);
    })

}

function logout() {
    fetch(API_URL + '/utente/logout', {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        clearLoggedUser();
        document.cookie = "tokenEpiOpera=; Max-Age=-99999999";
    })
    .catch((error) => console.error(error));
}

async function deleteAccount() {

    let text = "Are you sure you want to delete this account?"
    if(window.confirm(text) != true) return;

    await (fetch(API_URL + '/utente/' + loggedUser.username, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
    })
    .then(async (res) => {
        if(!res.ok) {
            const data = res.json();
            window.alert(data.Error || "Something went wrong");
            return;
        }
    })
    .catch(err => {
        window.alert("Network error");
        console.log(err);
        return;
    }));

    logout();
}

async function deletePost(postId) {

    let text = 'Are you sure you want to delete this post?'
    if(window.confirm(text) != true) return;

    await (fetch(API_URL + '/post/' + postId, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
    })
    .then(async (res) => {
        if(!res.ok) {
            const data = res.json();
            window.alert(data.Error || "Something went wrong");
            return;
        }
    })
    .catch(err => {
        window.alert("Network error");
        console.log(err);
        return;
    }));

    fetchPostsByUser();
}

const loggedUser = reactive({
    token: undefined,
    username: undefined,
    self: undefined
});

function setLoggedUser(data) {
    loggedUser.token = data.token;
    loggedUser.username = data.username;
    loggedUser.self = data.self;
}

function clearLoggedUser() {
    loggedUser.token = undefined;
    loggedUser.username = undefined;
    loggedUser.self = undefined;
}

export {
    login,
    register,
    logout,
    fetchUser,
    deleteAccount,
    deletePost,

    loggedUser,
    username,
    password,
    userreg,
    pswreg,
    pswreg2,
    email,
    warning,
    userObj,
    regOK
}