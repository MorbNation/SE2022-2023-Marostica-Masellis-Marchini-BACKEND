<script setup>
import { ref, watch, onMounted } from 'vue';
import { loggedUser, username, password, userreg, pswreg, pswreg2, email, login, register, logout, warning, userObj, fetchUser, deletePost, deleteAccount, regOK } from '../states/user';
import { fetchPostsByUser, postsByUser } from '../states/posts';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const titolo = ref('');
const tag = ref('');
const testo = ref('');
const newMail = ref('');
const newPsw = ref('');
const newPsw2 = ref('');
var selectedFile = "";
var nomeFile = "";

const mailOK = ref('');
const pswOK = ref('');
const nsfwOK = ref('');
// const emit = defineEmits(["login", "newPost"]);

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
    fetchPostsByUser();
    fetchUser();
    warning.value = '';
})

onMounted(() => {
    fetchPostsByUser();
    fetchUser();
})

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
    .then(async (res) => {Ilcalmissimo
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

</script>

<template>

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

        <div class="contentBox">
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
            <button type="button" class="smaller" @click="deletePost(post.id)">Delete</button>
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
                <input type="text" name="username" v-model="userreg" @keyup.enter="register" class="textBox" placeholder="Username" /><br />
                <input type="email" name="email" v-model="email" @keyup.enter="register" class="textBox" placeholder="Email" /><br />
                <input type="password" name="password" v-model="pswreg" @keyup.enter="register" class="textBox"  placeholder="Password"/><br />
                <input type="password" name="password2" v-model="pswreg2" @keyup.enter="register" class="textBox" placeholder="Repeat Password"/><br />
                <button type="button" class="generic" @click="register">Sign me up</button>
            </form>
            <span style="color: red;">{{ regOK }}</span>
        </div>
    </div>

</template>