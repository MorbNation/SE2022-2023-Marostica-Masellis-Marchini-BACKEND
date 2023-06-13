<script setup>
import { onMounted, ref } from 'vue';
import { user, fetchUser } from '../states/user'

const HOST = `http://localhost:8080/`;
const API_URL = HOST + '/api';

const warning = ref('');
const username = ref('');

async function getUser(){
    console.log("Orcodio");
    if(username.value == ''){
        warning.value = 'Please specify a username!';
        return;
    }
    warning.value = '';
    await fetchUser(username.value).catch( err => console.err(error) );
};

</script>

<template>
    <form>
        <span>Lookup user page</span>
        <br />
        <input v-model="username" />
        <button type="button" @click="getUser">Search user {{ username }}</button>
        <br />
        <span style="color: red">{{ warning }}</span>
    </form>
    <div>
        <p>{{ user.values.username_utente }}</p>
    </div>
</template>