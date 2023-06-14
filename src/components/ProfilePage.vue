<script setup>
import { ref, reactive, watch } from 'vue';
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/login';

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const username = ref('Ilcalmissimo');
const password = ref('Cotoletta.123');
// const warning = ref('');
const postsByUser = reactive([]);

const emit = defineEmits(["login"]);

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
    clearLoggedUser();
}
</script>

<template>
    <form>
        <span v-if="loggedUser.token">
            Welcome {{ loggedUser.username }}<br />
            <button type="button" @click="logout">Log out</button>
            <!-- <p style="color: red;">{{ warning }}</p> -->
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