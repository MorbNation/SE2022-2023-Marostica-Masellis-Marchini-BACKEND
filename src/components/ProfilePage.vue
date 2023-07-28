<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/login';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const username = ref('Ilcalmissimo');  /* TODO: change to empty and set placeholder for both */
const password = ref('Cotoletta.123');
const password2 = ref('');
const email = ref('');

const titolo = ref('');
const tag = ref('');
const testo = ref('');
const newMail = ref('');
const newPsw = ref('');
const newPsw2 = ref('');
var selectedFile = "";
var nomeFile = "";

const warning = ref('');
const postsByUser = reactive([]);
const userObj = reactive([]);
const mailOK = ref('');
const pswOK = ref('');
const nsfwOK = ref('');
const regOK = ref('');

const emit = defineEmits(["login", "newPost"]);

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
    fetchPostsByUser();
    fetchUser();
    warning.value = '';
})

onMounted(() => {
    fetchPostsByUser();
    fetchUser();
})

async function fetchUser() {
    if(loggedUser.username == undefined) {
        return;
    } else {
        userObj.values = await (await fetch(API_URL + '/utente/' + loggedUser.username, { credentials: 'include' })).json();
    }
} 

async function fetchPostsByUser() {
    if (loggedUser.username == undefined) {
        return;
    } else {
        postsByUser.values = await (await fetch(API_URL + '/post/user/' + loggedUser.username, { credentials: 'include' })).json();
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
            emit("login", loggedUser);
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
    if(password.value !== password2.value) {
        regOK.value = 'Password does not match';
        return;
    }

    let registrationBody = {
        username: username.value,
        email: email.value,
        password: password.value,
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
            emit("login", loggedUser);
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

function onFileChange(_file){
    let fileList = _file.target.files[0];
    selectedFile = fileList;
    nomeFile = fileList.name;
}

function onUploadFile(){
    const formData = new FormData();
    formData.append('file', selectedFile);

    let text = testo.value;
    let media = nomeFile;

    if(text == '') {
        console.log("Text is null");
        text = null;
    }
    if(media == '') {
        console.log("Media is null");
        media = null;
    }

    const postData = {
        titolo: titolo.value,
        testo: text,
        tag: tag.value.split(" "),
        media: media,
        username: loggedUser.username,
        associato_a_contest: []
    }

    if(media != null) {
        fetch(API_URL + '/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }

    document.cookie = `tokenEpiOpera=${loggedUser.token}`;

    fetch(API_URL + '/post', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(postData),
        credentials: 'include'
    })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });

    fetchPostsByUser();
}

function showHideSettings() {
    let elem = document.getElementById("settings");
    mailOK.value = '';
    pswOK.value = '';
    nsfwOK.value = '';
    if(elem.style.display === "none") elem.style.display = "block";
    else elem.style.display = "none";
}

function changeMail() {

    let newMailBody = {
        email: newMail.value
    }

    fetch(API_URL + '/utente/modificaMail', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newMailBody),
        credentials: 'include'
    })
    .then(async (res) => {
        if(res.ok){
            mailOK.value = 'Email changed succesfully!';
        } else {
            const data = await res.json();
            mailOK.value = data.Error || "Somwthing went wrong";
        }
    })
    .catch(err => {
        mailOK.value = "Network error";
        console.log(err);
    })
}

async function changePsw() {

    if(newPsw.value !== newPsw2.value){
        pswOK.value = 'Password does not match';
        return;
    }

    let newPswBody = {
        newPassword: newPsw.value
    }

    fetch(API_URL + '/utente/modificaPassword', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newPswBody),
        credentials: 'include'
    })
    .then(async (res) => {
        if(res.ok){
            pswOK.value = 'Password changed succesfully!';
        } else {
            const data = await res.json();
            pswOK.value = data.Error || "Something went wrong";
        }
    })
    .catch(err => {
        pswOK.value = "Network error";
        console.log(err);
    })
}

function changeNSFW() {
    let nsfwBody = {
        nsfw: nsfw.value
    }

    fetch(API_URL + '/utente/modificaNSFW', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(nsfwBody),
        credentials: 'include'
    })
    .then(async (res) => {
        if(res.ok){
            nsfwOK.value = "NSFW setting changed succesfully!";
        } else {
            const data = await res.json();
            nsfwOK.value = data.Error || "Something went wrong";
        }
    })
    .catch(err => {
        nsfwOK.value = "Network error";
        console.log(err);
    })
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

</script>

<template>
    <form enctype="multipart/form-data" novalidate>
        <div v-if="loggedUser.token" class="mainWrapper">

            <div class="userBox" v-for="user in userObj.values" :key="user.self" :style="{ backgroundImage: 'url(' + `/src/assets/` + user.banner + ')' }">

                <h2>Welcome {{ user.username }}</h2><br />
                <img class="circular" :src="'/src/assets/' + user.icona_profilo" alt="ProPic" width="100" height="100" /><br />
                <p>Userscore: {{ user.userscore }}</p>
                <button type="button" class="generic" @click="logout">Log out</button><br />
                <button type="button" class="generic" @click="showHideSettings">Settings</button>

                <div id="settings" class="contentBox" style="display: none;">

                    <input class="textBox" type="text" name="newMail" v-model="newMail" placeholder="New Email address" />
                    <button type="button" class="smaller" @click="changeMail">Submit</button><br />
                    <span style="color: red;">{{ mailOK }}</span>

                    <div class="table" style="display: flex; justify-content: center;">
                        <table style="display: block; margin: auto; align-self: auto;">
                            <tr>
                                <td><input type="password" class="textBox" name="newPsw" v-model="newPsw" placeholder="New Password" /></td>
                                <td rowspan="4"><button type="button" class="smaller" @click="changePsw">Submit</button></td>
                            </tr>
                            <tr>
                                <input type="password" class="textBox" name="newPsw" v-model="newPsw2" placeholder="Repeat Password" />
                            </tr>
                        </table>
                    </div>
                    <span style="color: red;">{{ pswOK }}</span><br />

                    <label for="nsfw" style="padding: 20px;">NSFW:</label>
                    <select name="nsfw" id="nsfw" v-model="nsfw">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="blur">Blur</option>
                    </select>
                    <button type="button" @click="changeNSFW" class="smaller">Submit</button><br />
                    <span style="color: red;">{{ nsfwOK }}</span>

                    <button type="button" class="generic" @click="deleteAccount">Delete this account</button>

                </div>
            </div>

            <div class="loginBox">
                <h4>Crea nuovo post</h4>
                <input class="textBox" type="text" name="titolo" v-model="titolo" placeholder="Titolo" /><br />
                <input class="textBox" type="text" name="testo" v-model="testo" placeholder="Testo" /><br />
                <input class="textBox" type="text" name="tags" v-model="tag" placeholder="Tags" /><br />
                <label for="file-upload" class="label">
                    <input type="file" id="file-upload" name="media" accept="image/*" @change="onFileChange"><br />
                </label>
                <button type="button" class="generic" @click="onUploadFile">Create post</button>
            </div>

            <div v-for="post in postsByUser.values" :key="post.self" class="contentBox">
                <h2>{{ post.titolo }}</h2>
                <img v-if="post.media != null" :src="'/src/assets/' + post.media" height="500" width="500"><br />
                <h3>{{ post.testo }}</h3><br />
                <p v-for="tag in post.tag">#{{ tag }}</p>
                <p>Upvotes: {{ post.punteggio_post }}</p>
                <date-format :date="new Date(post.data)"></date-format>
                <br />
            </div>

        </div>

        <div v-if="!loggedUser.token">
            <div class="loginBox">
                <h2>Login to your account</h2>
                <form @submit.prevent="login">
                    <input class="textBox" name="username" v-model="username" @keyup.enter="login" /><br />
                    <input class="textBox" type='password' name="password" v-model="password" @keyup.enter="login" /><br />
                    <button class="generic" type="button" @click="login">Log in</button>
                </form>
                <span style="color: red;">{{ warning }}</span>
            </div>

            <div class="loginBox">
                <h2>Sign up</h2>
                <form @submit.prevent="register">
                    <input type="text" name="username" v-model="username" @keyup.enter="register" class="textBox" placeholder="Username" /><br />
                    <input type="email" name="email" v-model="email" @keyup.enter="register" class="textBox" placeholder="Email" /><br />
                    <input type="password" name="password" v-model="password" @keyup.enter="register" class="textBox"  placeholder="Password"/><br />
                    <input type="password" name="password2" v-model="password2" @keyup.enter="register" class="textBox" placeholder="Repeat Password"/><br />
                    <button type="button" class="generic" @click="register">Sign me up</button>
                </form>
                <span style="color: red;">{{ regOK }}</span>
            </div>
        </div>
        

    </form>
</template>