<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { loggedUser, follow } from '../states/user';
import { vote, savePost } from '../states/posts';
import { postComments, commentsOK, fetchCommentsByPost, voteComment, segnalaCommento, deleteCommento, editCommento, commento, addComment, commEdit } from '../states/post_comment';
import { showHide } from '../states/util';
import { profileComments, pcommentsOK, pcommEdit, pcommEditTitle, fetchPCommentsByUser, pcommento, ptitolo, addPComment, votePComment, segnalaPCommento, deletePCommento, editPCommento } from '../states/profile_comment';
import { useRoute } from 'vue-router';

const HOST = `https://epiopera-4f1c76fdd577.herokuapp.com`;
const API_URL = HOST + 'api';

const route = useRoute();
const warning = ref('');
const username = ref('');
const userPosts = reactive([]);
const user = reactive([]);

onMounted(() => {
    username.value = route.params.username;

    if(username.value != undefined){
        getUser();
    }
});

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
            <button v-if="loggedUser.token" type="button" class="generic" @click="follow(_user.username)">Follow/Unfollow</button><br /><br />
            <img class="circular" :src="'/assets/' + _user.icona_profilo" alt="ProPic" width="100" height="100" /><br />
            <p>Userscore: {{ _user.userscore }}</p>
            <button type="button" class="smaller" @click="showHide('commenti' + _user.username); fetchPCommentsByUser(_user.username)">Comms</button>
            <div class="contentBox" :id="'commenti' + _user.username" style="display: none;">
                <h3 v-if="profileComments.length == 0">No comments</h3>
                <div v-if="(loggedUser.username != _user.username) && (loggedUser.token)">
                    <h2>New comment</h2>
                    <input type="text" class="textBox" v-model="ptitolo" placeholder="Title" /><br />
                    <input type="text" class="textBox" v-model="pcommento" placeholder="Text" /><br />
                    <button type="button" class="smaller" @click="addPComment(_user.username)">Submit</button>
                </div>
                <div v-for="comment in profileComments" :key="comment.self">
                    <h2>{{ comment.titolo }}</h2>
                    <h3>{{ comment.creatore_commento }}</h3>
                    <p>{{ comment.testo }}</p>
                    <p>Voto: {{ comment.punteggio_commento }}</p>
                    <button type="button" class="vote" v-if="loggedUser.token" @click="votePComment(1, comment.id)">Upvote</button>
                    <button type="button" class="vote" v-if="loggedUser.token" @click="votePComment(-1, comment.id)">Downvote</button>
                    <button type="button" class="smaller" v-if="loggedUser.token" @click="segnalaPCommento(comment.id)">Flag</button>
                    <button type="button" class="smaller" v-if="loggedUser.username == comment.creatore_commento" @click="deletePCommento(comment.id)">Delete</button>
                    <button type="button" class="smaller" v-if="loggedUser.username == comment.creatore_commento" @click="showHide('edit' + comment.id)">Edit</button>
                    <div v-if="loggedUser.username == comment.creatore_commento" :id="'edit' + comment.id" style="display: none;">
                        <input type="text" class="textBox" v-model="pcommEditTitle" placeholder="New Title" /><br />
                        <input type="text" class="textBox" v-model="pcommEdit" placeholder="New Text" /><br />
                        <button type="button" class="smaller" @click="editPCommento(comment.id)">Submit</button>
                    </div>
                </div>
                <span style="color: red;">{{ pcommentsOK }}</span>
            </div>
        </div>

        <div v-for="post in userPosts.values" :key="post.self" class="contentBox">
            <h2>{{ post.titolo }}</h2>
            <img :src="'/assets/' + post.media" height="500" width="500"><br />
            <p>{{ post.testo }}</p>
            <p v-for="tag in post.tag">#{{ tag }}</p>text
            <p>Upvotes: {{ post.punteggio_post }}</p>
            <date-format :date="new Date(post.data)"></date-format><br /><br />
            <button class="vote" v-if="loggedUser.token" @click="vote(1, post.id)">Upvote</button>
            <button class="vote" v-if="loggedUser.token" @click="vote(-1, post.id)">Downvote</button>
            <button class="smaller" v-if="loggedUser.token" @click="savePost(post.id)">Save</button>
            <button type="button" class="smaller" @click="showHide('commento' + post.id); fetchCommentsByPost(post.id)">Comms</button><br />
            <div class="contentBox" name="commento" :id="'commento' + post.id" style="display: none;">
                <div v-if="loggedUser.token" name="newComment">
                    <input type="text" class="textBox" name="newCommento" v-model="commento" placeholder="Comment" />
                    <button type="button" class="smaller" @click="addComment(post.id)">Submit</button>
                </div>
                <h3 v-if="postComments.length == 0">No comments</h3>
                <div v-for="comment in postComments" :key="comment.self">
                    <h2>{{ comment.creatore_commento }}   </h2>
                    <p>{{ comment.testo }}</p>
                    <p>Voto: {{ comment.punteggio_commento }}</p><br />
                    <button type="button" class="vote" v-if="loggedUser.token" @click="voteComment(1, comment.id)">Upvote</button>
                    <button type="button" class="vote" v-if="loggedUser.token" @click="voteComment(-1, comment.id)">Downvote</button>
                    <button type="button" class="smaller" v-if="loggedUser.token" @click="segnalaCommento(comment.id)">Flag</button>
                    <button type="button" class="smaller" v-if="loggedUser.username == comment.creatore_commento" @click="deleteCommento(comment.id)">Delete</button>
                    <button type="button" class="smaller" v-if="loggedUser.username == comment.creatore_commento" @click="showHide('edit' + comment.id)">Edit</button>
                    <div v-if="loggedUser.username == comment.creatore_commento" :id="'edit' + comment.id" style="display: none;">
                        <input type="text" class="textBox" v-model="commEdit" placeholder="Text" />
                        <button type="button" class="smaller" @click="editCommento(comment.id)">Submit</button>
                    </div>
                </div>
                <span style="color: red;">{{ commentsOK }}</span>
            </div>
            <button type="button" class="smaller" v-if="loggedUser.token" @click="segnala(post.id)">Flag</button>
            <br /><br />
        </div>

    </div>

</template>