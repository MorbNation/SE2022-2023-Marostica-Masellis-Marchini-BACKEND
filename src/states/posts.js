import { reactive } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const posts = reactive([]);

async function fetchPosts() {
    posts.values = await (await fetch(API_URL + '/posts')).json();
}

export { posts, fetchPosts };