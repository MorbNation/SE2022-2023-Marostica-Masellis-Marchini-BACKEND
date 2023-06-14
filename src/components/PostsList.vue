<script setup>
import { onMounted, ref } from 'vue';
import { posts, fetchPosts } from '../states/posts.js'

const HOST = `http://localhost:8080/`;
const API_URL = HOST + '/api';

onMounted( () => {
    fetchPosts();
});

</script>

<template>
    <div v-for="post in posts.values" :key="post.self">
        <h4>u/{{ post.creatore_post }}</h4>
        <h2>{{ post.titolo }}</h2>
        <img :src="'/src/assets/' + post.media" height="500" width="500"><br />
        <p>{{ post.testo }}</p>
        <p v-for="tag in post.tag">#{{ tag }}</p>
        <p>Upvotes: {{ post.punteggio_post }}</p>
        <date-format :date="new Date(post.data)"></date-format>
        <br /><br />
    </div>
</template>