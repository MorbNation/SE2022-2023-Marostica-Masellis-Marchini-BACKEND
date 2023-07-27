<script setup>
import { onActivated, onBeforeMount, onMounted, ref } from 'vue';
import { posts, fetchPosts, vote } from '../states/posts.js'
import { loggedUser } from '../states/login';

const HOST = `http://localhost:8080/`;
const API_URL = HOST + '/api';

onMounted(() => {
    fetchPosts();
});

onActivated(() => {
    fetchPosts();
})

</script>

<template>

    <div class="mainWrapper">

        <div v-for="post in posts.values" :key="post.self" class="contentBox">
            <h4>u/{{ post.creatore_post }}</h4>
            <h2>{{ post.titolo }}</h2>
            <img :src="'/src/assets/' + post.media" height="500" width="500"><br />
            <p>{{ post.testo }}</p>
            <p v-for="tag in post.tag">#{{ tag }}</p>
            <p>Upvotes: {{ post.punteggio_post }}</p>
            <date-format :date="new Date(post.data)"></date-format><br /><br />
            <button class="vote" v-if="loggedUser.token" @click="vote(1, post.id)">Upvote</button>
            <button class="vote" v-if="loggedUser.token" @click="vote(-1, post.id)">Downvote</button>
            <br /><br />
        </div>

    </div>

</template>