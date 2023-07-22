<script setup>
import { onMounted, reactive, ref } from 'vue';

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
    <form @submit.prevent="getUser">
        <span>Lookup user page</span>
        <br />
        <input v-model="username" @keyup.enter="getUser" />
        <button type="button" @click="getUser">Search user {{ username }}</button>
        <br />
        <span style="color: red">{{ warning }}</span>
    </form>
    <div v-for="post in userPosts.values" :key="post.self">
        <h2>{{ post.titolo }}</h2>
        <img :src="'/src/assets/' + post.media" height="500" width="500"><br />
        <p>{{ post.testo }}</p>
        <p v-for="tag in post.tag">#{{ tag }}</p>
        <p>Upvotes: {{ post.punteggio_post }}</p>
        <date-format :date="new Date(post.data)"></date-format>
        <br /><br />
    </div>
</template>