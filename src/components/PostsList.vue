<script setup>
import { onMounted, reactive } from 'vue';
import { ref } from 'vue';

const HOST = `http://localhost:8080`;
const posts = reactive([]);

async function showPosts() {
    posts.values = await (await fetch(HOST + 'api/posts')).json();
}

onMounted( () => {
    showPosts();
});

</script>

<template>
    <h1>Post:</h1>
    <ul>
        <li v-for="post in posts.values" :key="post.self">
            <a :href="HOST+'/api'+post.self">{{ post.id }}</a>
            -
        </li>
    </ul>
</template>