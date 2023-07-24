<script setup>
import { onMounted, reactive, ref } from 'vue';
import { loggedUser } from '../states/login';

const HOST = `http://localhost:8080/`;
const API_URL = HOST + 'api';

const warning = ref('');
const username = ref('');
const userPosts = reactive([]);

async function getUser(){
    if(username.value == ''){
        warning.value = 'Please specify a username!';
        return;
    }
    warning.value = '';

    userPosts.values = await (await fetch(API_URL + `/post/user/${username.value}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })).json();

    console.log(userPosts.values);
};

</script>

<template>

    <div class="contentBox">
        <form @submit.prevent="getUser">
            <span>Lookup user page</span>
            <br />
            <input class="textBox" v-model="username" @keyup.enter="getUser" />
            <button type="button" @click="getUser">Search user</button>
            <br />
            <span style="color: red">{{ warning }}</span>
        </form>
    </div>

    <div v-for="post in userPosts.values" :key="post.self" class="contentBox">
        <h2>{{ post.titolo }}</h2>
        <img :src="'/src/assets/' + post.media" height="500" width="500"><br />
        <p>{{ post.testo }}</p>
        <p v-for="tag in post.tag">#{{ tag }}</p>
        <p>Upvotes: {{ post.punteggio_post }}</p>
        <date-format :date="new Date(post.data)"></date-format>
        <br /><br />
    </div>

</template>