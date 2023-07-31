<script setup>
import { reactive, ref } from 'vue';
import { loggedUser } from '../states/user';
import { vote } from '../states/posts';

const HOST = `http://localhost:8080/`;
const API_URL = HOST + 'api';

const warning = ref('');
const username = ref('');
const userPosts = reactive([]);
const user = reactive([]);

async function getUser() {
    userPosts.values = [];
    user.values = [];

    if(username.value == ''){
        warning.value = 'Please specify a username!';
        return;
    }
    warning.value = '';

    try {
        const response = await fetch(API_URL + '/utente/' + username.value, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const data = await response.json();
            warning.value = data.Error || "Something went wrong";
        } else {
            user.values = await response.json();
        }
    } catch (err) {
        warning.value = 'Network error';
        console.log(err);
    }

    try {
        const response = await fetch(API_URL + '/post/user/' + username.value, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const data = await response.json();
            warning.value = data.Error || "Something went wrong";
            userPosts.values = []; // Empty the userPosts.values in case of an error.
        } else {
            userPosts.values = await response.json();
        }
    } catch (err) {
        warning.value = 'Network error';
        console.log(err);
        userPosts.values = []; // Empty the userPosts.values in case of a network error.
    }
}

</script>

<template>

    <div class="mainWrapper">

        <div class="contentBox">
            <form @submit.prevent="getUser">
                <span>Lookup user page</span>
                <br />
                <input class="textBox" v-model="username" @keyup.enter="getUser" placeholder="Username" />
                <button type="button" class="generic" @click="getUser">Search user</button>
                <br />
                <span style="color: red">{{ warning }}</span>
            </form>
        </div>

        <div class="userBox" v-for="_user in user.values" :key="self" :style="{ backgroundImage: 'url(' + `/src/assets/` + _user.banner + ')' }">
            <h2>{{ _user.username }}</h2>
            <img class="circular" :src="'/src/assets/' + _user.icona_profilo" alt="ProPic" width="100" height="100" /><br />
            <p>Userscore: {{ _user.userscore }}</p>
        </div>

        <div v-for="post in userPosts.values" :key="post.self" class="contentBox">
            <h2>{{ post.titolo }}</h2>
            <img :src="'/src/assets/' + post.media" height="500" width="500"><br />
            <p>{{ post.testo }}</p>
            <p v-for="tag in post.tag">#{{ tag }}</p>
            <p>Upvotes: {{ post.punteggio_post }}</p>
            <date-format :date="new Date(post.data)"></date-format><br /><br />
            <button class="vote" v-if="loggedUser.token" @click="vote(1, post.id)">Upvote</button>
            <button class="vote" v-if="loggedUser.token" @click="vote(-1, post.id)">Downvote</button>
            <button type="button" class="smaller" @click="showHide('commento' + post.id); fetchCommentsByPost(post.id)">Comms</button><br />
            <div class="contentBox" name="commento" :id="'commento' + post.id" style="display: none;">
                <div v-if="loggedUser.token" name="newComment">
                    <input type="text" class="textBox" name="commento" v-model="commento" placeholder="Comment" />
                    <button type="button" class="smaller" @click="addComment(post.id)">Submit</button>
                </div>
                <div v-for="comment in postComments" :key="comment.self">
                    <h2>{{ comment.creatore_commento }}   </h2>
                    <p>{{ comment.testo }}</p>
                    <p>Voto: {{ comment.punteggio_commento }}</p><br />
                </div>
                <span style="color: red;">{{ commentsOK }}</span>
            </div>
            <button type="button" class="smaller" v-if="loggedUser.token" @click="segnala(post.id)">Flag</button>
            <br /><br />
        </div>

    </div>

</template>