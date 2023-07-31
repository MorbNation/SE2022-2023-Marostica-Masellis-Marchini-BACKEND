<script setup>
import { ref, watch, onMounted } from 'vue';
import { loggedUser, username, password, userreg, pswreg, pswreg2, email, login, register, logout, warning, userObj, fetchUser, deletePost, deleteAccount, regOK, mailOK, pswOK, nsfwOK, changeMail, changeNSFW, changePsw, newMail, newPsw, newPsw2 } from '../states/user';
import { fetchPostsByUser, postsByUser, editPost, editOK, titolo, testo, tag, commento, addComment } from '../states/posts';
import { showHide } from '../states/util';
import { postComments, commentsOK, fetchCommentsByPost } from '../states/post_comment'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`;
const API_URL = HOST + '/api';

const titolo2 = ref('');
const tag2 = ref('');
const testo2 = ref('');
var selectedFile = "";
var nomeFile = "";

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
    fetchPostsByUser();
    fetchUser();
    warning.value = '';
})

onMounted(() => {
    fetchPostsByUser();
    fetchUser();
})

function onFileChange(_file){
    let fileList = _file.target.files[0];
    selectedFile = fileList;
    nomeFile = fileList.name;
}

function onUploadFile(){
    const formData = new FormData();
    formData.append('file', selectedFile);

    let text = testo2.value;
    let media = nomeFile;

    if(text == '') {
        console.log("Text is null");
        text = null;
    }
    if(media == '') {
        console.log("Media is null");
        media = null;
    }

    const postData = {
        titolo: titolo2.value,
        testo: text,
        tag: tag2.value.split(" "),
        media: media,
        username: loggedUser.username,
        associato_a_contest: []
    }

    if(media != null) {
        fetch(API_URL + '/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }

    document.cookie = `tokenEpiOpera=${loggedUser.token}`;

    fetch(API_URL + '/post', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(postData),
        credentials: 'include'
    })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });

    fetchPostsByUser();
}

</script>

<template>

    <div v-if="loggedUser.token" class="mainWrapper">

        <div class="userBox" v-for="user in userObj.values" :key="user.self" :style="{ backgroundImage: 'url(' + `/src/assets/` + user.banner + ')' }">

            <h2>Welcome {{ user.username }}</h2><br />
            <img class="circular" :src="'/src/assets/' + user.icona_profilo" alt="ProPic" width="100" height="100" /><br />
            <p>Userscore: {{ user.userscore }}</p>
            <button type="button" class="generic" @click="logout">Log out</button><br />
            <button type="button" class="generic" @click="showHide('settings')">Settings</button>

            <div id="settings" class="contentBox" style="display: none;">

                <input class="textBox" type="text" name="newMail" v-model="newMail" placeholder="New Email address" />
                <button type="button" class="smaller" @click="changeMail">Submit</button><br />
                <span style="color: red;">{{ mailOK }}</span>

                <div class="table" style="display: flex; justify-content: center;">
                    <table style="display: block; margin: auto; align-self: auto;">
                        <tr>
                            <td><input type="password" class="textBox" name="newPsw" v-model="newPsw" placeholder="New Password" /></td>
                            <td rowspan="4"><button type="button" class="smaller" @click="changePsw">Submit</button></td>
                        </tr>
                        <tr>
                            <input type="password" class="textBox" name="newPsw" v-model="newPsw2" placeholder="Repeat Password" />
                        </tr>
                    </table>
                </div>
                <span style="color: red;">{{ pswOK }}</span><br />

                <label for="nsfw" style="padding: 20px;">NSFW:</label>
                <select name="nsfw" id="nsfw" v-model="nsfw">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="blur">Blur</option>
                </select>
                <button type="button" @click="changeNSFW" class="smaller">Submit</button><br />
                <span style="color: red;">{{ nsfwOK }}</span>

                <button type="button" class="generic" @click="deleteAccount">Delete this account</button>

            </div>
        </div>

        <div class="contentBox">
            <h4>Crea nuovo post</h4>
            <input class="textBox" type="text" name="titolo" v-model="titolo2" placeholder="Titolo" /><br />
            <input class="textBox" type="text" name="testo" v-model="testo2" placeholder="Testo" /><br />
            <input class="textBox" type="text" name="tags" v-model="tag2" placeholder="Tags" /><br />
            <label for="file-upload" class="label">
                <input type="file" id="file-upload" name="media" accept="image/*" @change="onFileChange"><br />
            </label>
            <button type="button" class="generic" @click="onUploadFile">Create post</button>
        </div>

        <div v-for="post in postsByUser.values" :key="post.self" class="contentBox">
            <h2>{{ post.titolo }}</h2>
            <img v-if="post.media != null" :src="'/src/assets/' + post.media" height="500" width="500"><br />
            <h3>{{ post.testo }}</h3><br />
            <p v-for="tag in post.tag">#{{ tag }}</p>
            <p>Upvotes: {{ post.punteggio_post }}</p>
            <date-format :date="new Date(post.data)"></date-format>
            <br/>
            <button type="button" class="smaller" @click="showHide('commento' + post.id); fetchCommentsByPost(post.id)">Comms</button><br />
            <div class="contentBox" name="commento" :id="'commento' + post.id" style="display: none;">
                <div v-for="comment in postComments" :key="comment.self">
                    <h2>{{ comment.creatore_commento }}   </h2>
                    <p>{{ comment.testo }}</p>
                    <p>Voto: {{ comment.punteggio_commento }}</p><br />
                </div>
                <span style="color: red;">{{ commentsOK }}</span>
            </div>
            <button type="button" class="smaller" @click="showHide(post.id)">Edit</button>
            <div :id="post.id" style="display: none;">
                <h3>Edit post</h3>
                <input type="text" class="textBox" name="titolo" v-model="titolo" placeholder="New title" /><br />
                <input type="text" class="textBox" name="testo" v-model="testo" placeholder="New text" /><br />
                <input type="text" class="textBox" name="tags" v-model="tag" placeholder="New Tags" /><br />
                <button type="button" class="smaller" @click="editPost(post.id, post.media)">Submit</button><br />
                <span style="color: red;">{{ editOK }}</span>
            </div>
            <br />
            <button type="button" class="smaller" @click="deletePost(post.id)">Delete</button>
        </div>

    </div>

    <div v-if="!loggedUser.token">
        <div class="loginBox">
            <h2>Login to your account</h2>
            <form @submit.prevent="login">
                <input class="textBox" name="username" v-model="username" @keyup.enter="login" /><br />
                <input class="textBox" type='password' name="password" v-model="password" @keyup.enter="login" /><br />
                <button class="generic" type="button" @click="login">Log in</button>
            </form>
            <span style="color: red;">{{ warning }}</span>
        </div>

        <div class="loginBox">
            <h2>Sign up</h2>
            <form @submit.prevent="register">
                <input type="text" name="username" v-model="userreg" @keyup.enter="register" class="textBox" placeholder="Username" /><br />
                <input type="email" name="email" v-model="email" @keyup.enter="register" class="textBox" placeholder="Email" /><br />
                <input type="password" name="password" v-model="pswreg" @keyup.enter="register" class="textBox"  placeholder="Password"/><br />
                <input type="password" name="password2" v-model="pswreg2" @keyup.enter="register" class="textBox" placeholder="Repeat Password"/><br />
                <button type="button" class="generic" @click="register">Sign me up</button>
            </form>
            <span style="color: red;">{{ regOK }}</span>
        </div>
    </div>

</template>