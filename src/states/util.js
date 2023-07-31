import { mailOK, pswOK, nsfwOK  } from "./user";
import { editOK } from "./posts";

function showHide(id) {
    if(id.startsWith('commento')) {
        let commentDivArray = document.getElementsByName('commento');
        for(let div of commentDivArray) {
            if(!(id == div.id)) {
                div.style.display = 'none';
            }    
        }
    }

    let elem = document.getElementById(id);
    if(id === 'settings') {
        mailOK.value = '';
        pswOK.value = '';
        nsfwOK.value = '';
    } else {
        editOK.value = '';
    }
    if(elem.style.display === "none") elem.style.display = "block";
    else elem.style.display = "none";
}

export { showHide };