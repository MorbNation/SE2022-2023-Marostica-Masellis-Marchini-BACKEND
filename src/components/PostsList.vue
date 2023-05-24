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
    <h1>Post:</h1>
    <ul>
        <li v-for="post in posts.values" :key="post.self">
            <!-- <a :href="HOST+post.self">{{ post.id }}</a> -->
            <img :src="'/src/assets/' + post.media" height="500" width="500">
        </li>
    </ul>
</template>