<script setup>
import { onActivated, onMounted } from 'vue';
import { posts, fetchPosts, vote, segnala, savePost } from '../states/posts.js'
import { loggedUser } from '../states/user';
import { showHide } from '../states/util';
import { postComments, commentsOK, fetchCommentsByPost, voteComment, segnalaCommento, deleteCommento, editCommento, commEdit, commento, addComment } from '../states/post_comment';

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
            <img :src="'../media/' + post.media" height="500" width="500"><br />
            <p>{{ post.testo }}</p>
            <p v-for="tag in post.tag">#{{ tag }}</p>
            <p>Upvotes: {{ post.punteggio_post }}</p>
            <date-format :date="new Date(post.data)"></date-format><br /><br />
            <button class="vote" v-if="loggedUser.token" @click="vote(1, post.id)">Upvote</button>
            <button class="vote" v-if="loggedUser.token" @click="vote(-1, post.id)">Downvote</button>
            <button class="smaller" v-if="loggedUser.token" @click="savePost(post.id)">Save</button>
            <button type="button" class="smaller" @click="showHide('commento' + post.id); fetchCommentsByPost(post.id)">Comms</button><br />
            <div class="contentBox" name="commento" :id="'commento' + post.id" style="display: none;">
                <div v-if="loggedUser.token" name="newComment">
                    <input type="text" class="textBox" name="nuovocommento" v-model="commento" placeholder="Comment" />
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