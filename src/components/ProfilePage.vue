<script setup>
import { ref, reactive, watch } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/login';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const username = ref('Ilcalmissimo');
const password = ref('Cotoletta.123');

const titolo = ref('Titolo');
const tag = ref('Tags');
const testo = ref('Testo');
var selectedFile = "";

// const warning = ref('');
const postsByUser = reactive([]);

const emit = defineEmits(["login", "newPost"]);

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
    fetchPostsByUser();
})

async function fetchPostsByUser() {
    // warning.value = 'aaa';
    if (loggedUser.username == undefined) {
        return;
    } else {
        postsByUser.values = await (await fetch(API_URL + '/post/user/' + loggedUser.username)).json();
    }
}

function login() {
    fetch(API_URL + "/utente/login", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
        .then((res) => res.json())
        .then(function (data) {
            setLoggedUser(data);
            emit("login", loggedUser);
            return;
        })
        .catch((error) => console.error(error));
};

function logout() {
    fetch(API_URL + '/utente/logout', {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    })
    .then(() => {
        clearLoggedUser();
    })
    .catch((error) => console.error(error));
}

function onFileChange(_file){
    let fileList = _file.target.files[0];
    selectedFile = fileList;
}

function onUploadFile(){
    const formData = new FormData();
    formData.append('file', selectedFile);

    const postData = {
        titolo: titolo.value,
        testo: testo.value,
        tag: tag.value.split(" "),
        media: selectedFile,
        creatore_post: loggedUser.username
    }

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

    fetch(API_URL + 'post', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`
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
}

</script>

<template>
    <form enctype="multipart/form-data" novalidate>
        <span v-if="loggedUser.token">
            <h2>Welcome {{ loggedUser.username }}</h2>
            <button type="button" @click="logout">Log out</button><br /><br />

            <h4>Crea nuovo post</h4>
            <div>
                <input name="titolo" v-model="titolo" /><br />
                <input name="testo" v-model="testo" /><br />
                <input name="tags" v-model="tag" /><br />
                <input type="file" name="media" accept="image/*" @change="onFileChange"><br />
                <button @click="onUploadFile">Create post</button>
            </div>

            <div v-for="post in postsByUser.values" :key="post.self">
                <h2>{{ post.titolo }}</h2>
                <img :src="'/src/assets/' + post.media" height="500" width="500"><br />
                <p>{{ post.testo }}</p>
                <p v-for="tag in post.tag">#{{ tag }}</p>
                <p>Upvotes: {{ post.punteggio_post }}</p>
                <date-format :date="new Date(post.data)"></date-format>
                <br /><br />
            </div>

        </span>
        <span v-if="!loggedUser.token">
            <input name="email" v-model="username" /><br />
            <input name="password" v-model="password" /><br />
            <button type="button" @click="login">Log in</button>
        </span>
    </form>
</template>