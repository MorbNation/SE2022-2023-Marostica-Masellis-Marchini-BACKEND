import { reactive } from "vue";

const loggedUser = reactive({
    token: undefined,
    username: undefined,
    self: undefined
});

function setLoggedUser (data){
    loggedUser.token = data.token;
    loggedUser.username = data.username;
    loggedUser.self = data.self;
}

function clearLoggedUser (){
    loggedUser.token = undefined;
    loggedUser.username = undefined;
    loggedUser.self = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser };