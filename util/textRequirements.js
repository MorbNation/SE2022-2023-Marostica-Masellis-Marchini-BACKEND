const controlla = (item) => {
    if(item>='A' && item<='Z'){
        //console.log(item+" 0");
        return 0;
    }
    if(item>='a' && item<='z'){
        //console.log(item+" 1");
        return 1;
    }
    if(item>='0' && item<='9'){
        //console.log(item+" 2");
        return 2;
    }
    //console.log(item+" 3");
    return 3;
}

const checkPassword = (pass) => {

    const leng = pass.length;

    var M = 0;
    var m = 0;
    var n = 0;
    var s = 0;

    pass=pass.split("");

    for(var i=0;i<leng;i++){
        switch(controlla(pass[i])){
            case 0:
                M++;
                break;
            case 1:
                m++;
                break;
            case 2:
                n++
                break;
            case 3:
                s++
                break;
        }
    }

    // la password deve avere almeno una maiuscola, minuscola, numero, carattere speciale ed essere almeno 12 caratteri
    if(M==0 || m==0 || n==0 || s==0 || leng<12){
        return false;
    }

    return true;
}

const checkMail = (mail) => {

    const pattern = /.+@+.+unitn\.it$/;

    // La mail usata per la registrazione deve essere del dominio unitn.it
    if(!pattern.test(mail)){
        return false;
    }

    return true;
}

const checkUsername = (username) => {

    const lengn = username.length;
    var con = false;;

    username=username.split("");

    for(var i=0;i<lengn;i++){
        if(username[i]=='@' || username[i]=='#'){
            con = true;
        }
    }

    // L'username deve essere almeno lungo 3 caratteri e non deve contenere i caratteri "@" e "#"
    if(con || lengn<3){
        return false;
    }

    return true;
}

const checkSamePassword = (pass1, pass2) => {

    return pass1 == pass2;
}

module.exports = { checkMail, checkPassword, checkUsername, checkSamePassword }