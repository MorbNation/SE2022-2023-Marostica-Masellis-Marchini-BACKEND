import{j as a,k as d}from"./index-990f6206.js";const P={}.VITE_API_HOST||`http://localhost:${{}.HEROKU}`,r=P+"/api",T=a("Ilcalmissimo"),C=a("Cotoletta.123"),U=a(""),k=a(""),_=a(""),b=a(""),B=a(""),j=a(""),J=a(""),p=a(""),I=d([]),u=a(""),f=a(""),w=a(""),g=a("");async function A(){s.username!=null&&(I.values=await(await fetch(r+"/utente/"+s.username,{credentials:"include"})).json())}function V(){fetch(r+"/utente/login",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:T.value,password:C.value})}).then(async o=>{if(o.ok){const t=await o.json();N(t),document.cookie=`tokenEpiOpera=${t.token}`,p.value=""}else{const t=await o.json();p.value=t.Error||"Credentials are incorrect"}}).catch(o=>{p.value="Network error",console.log(o)})}function z(){if(k.value!==_.value){u.value="Password does not match";return}let o={username:U.value,email:b.value,password:k.value,utenti_seguiti:[],post_favoriti:[]};fetch(r+"/utente",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"}).then(async t=>{if(t.ok){const e=await t.json();N(e),document.cookie=`tokenEpiOpera=${e.token}`,u.value=""}else{const e=await t.json();u.value=e.Error||"Something went wrong"}}).catch(t=>{u.value="Network error",console.log(t)})}function D(){fetch(r+"/utente/logout",{method:"PUT",headers:{"Content-Type":"application/json"}}).then(()=>{H(),document.cookie="tokenEpiOpera=; Max-Age=-99999999"}).catch(o=>console.error(o))}async function q(){let o="Are you sure you want to delete this account?";window.confirm(o)==!0&&(await fetch(r+"/utente/"+s.username,{method:"DELETE",headers:{"Content-type":"application/json"},credentials:"include"}).then(async t=>{if(!t.ok){const e=t.json();window.alert(e.Error||"Something went wrong");return}}).catch(t=>{window.alert("Network error"),console.log(t)}),D())}async function Q(o){let t="Are you sure you want to delete this post?";window.confirm(t)==!0&&(await fetch(r+"/post/"+o,{method:"DELETE",headers:{"Content-type":"application/json"},credentials:"include"}).then(async e=>{if(!e.ok){const n=e.json();window.alert(n.Error||"Something went wrong");return}}).catch(e=>{window.alert("Network error"),console.log(e)}),O())}function X(){let o={email:B.value};fetch(r+"/utente/modificaMail",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"}).then(async t=>{if(t.ok)f.value="Email changed succesfully!";else{const e=await t.json();f.value=e.Error||"Somwthing went wrong"}}).catch(t=>{f.value="Network error",console.log(t)})}async function Y(){if(j.value!==J.value){w.value="Password does not match";return}let o={newPassword:j.value};fetch(r+"/utente/modificaPassword",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"}).then(async t=>{if(t.ok)w.value="Password changed succesfully!";else{const e=await t.json();w.value=e.Error||"Something went wrong"}}).catch(t=>{w.value="Network error",console.log(t)})}function Z(){let o={nsfw:nsfw.value};fetch(r+"/utente/modificaNSFW",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"}).then(async t=>{if(t.ok)g.value="NSFW setting changed succesfully!";else{const e=await t.json();g.value=e.Error||"Something went wrong"}}).catch(t=>{g.value="Network error",console.log(t)})}async function ee(o){let t={utenteDaSeguire:o};try{const e=await fetch(r+"/utente/segui",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}A()}const s=d({token:void 0,username:void 0,self:void 0});function N(o){s.token=o.token,s.username=o.username,s.self=o.self}function H(){s.token=void 0,s.username=void 0,s.self=void 0}const K={}.VITE_API_HOST||`http://localhost:${{}.HEROKU}`,c=K+"/api",L=d([]),y=d([]),v=d([]),$=a(""),R=a(""),F=a(""),m=a(""),G=a("");async function te(o,t){let e={id:o,titolo:$.value,testo:R.value,tag:F.value.split(" "),media:t};try{const n=await fetch(c+"/post/modifica",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(e),credentials:"include"});if(n.ok)m.value="Success",O();else{const l=await n.json();m.value=l.Error||"Something went wrong"}}catch(n){m.value="Network error",console.log(n)}}async function oe(){try{const o=await fetch(c+"/posts",{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(o.ok)L.values=await o.json();else{const t=await o.json();window.alert(t.Error||"Something went wrong")}}catch(o){window.alert("Network error"),console.log(o)}}async function O(){if(s.username!=null)try{const o=await fetch(c+"/post/user/"+s.username,{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(o.ok)y.values=await o.json();else{const t=await o.json();window.alert(t.Error||"Something went wrong"),y.values=[]}}catch(o){window.alert("Network error"),console.log(o),y.values=[]}}async function ne(o,t){console.log("id: "+t+`
score: `+o+`
token: `+s.token);const e={id:t,valutazione:o};await fetch(c+"/post/valuta",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(e),credentials:"include"}).then(n=>{console.log(n.headers.get("set-cookie"))}).catch(n=>{console.log(n)})}async function ae(o){const t={id:o};try{const e=await fetch(c+"/post/segnala",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"});if(e.ok)console.log(await e.json());else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Something went wrong"),console.log(e)}}async function se(o){console.log(o),v.splice(0);for(const t of o)try{const e=await fetch(c+"/post/id/"+t,{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(e.ok)v.push(await e.json());else{const n=await e.json();G.value=n.Error||"Something went wrong",console.log(n.Error)}}catch(e){v.push({titolo:"Netwrok error"}),console.log(e)}}async function re(o){let t={id:o};try{const e=await fetch(c+"/post/salvaNeiFavoriti",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}function ie(o){if(o.startsWith("commento")){let e=document.getElementsByName("commento");for(let n of e)o!=n.id&&(n.style.display="none")}let t=document.getElementById(o);o==="settings"?(f.value="",w.value="",g.value=""):m.value="",t.style.display==="none"?t.style.display="block":t.style.display="none"}const M={}.VITE_API_HOST||`http://localhost:${{}.HEROKU}`,i=M+"/api",h=d([]),E=a(""),x=a(""),S=a("");async function ce(o){let t={id_post:o,testo:S.value};S.value="";try{const e=await fetch(i+"/commento_post",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();console.log(e),window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}async function le(o){let t=[];h.splice(0);try{const e=await fetch(i+"/commento_post/all/"+o,{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(e.ok)t=await e.json();else{const n=await e.json();E.value=n.Error||"Something went wrong",t=[]}}catch(e){E.value="Network error",console.log(e),t=[]}for(const e of t){console.log("fetching post "+e);try{const n=await fetch(i+"/commento_post/"+e,{method:"GET",headers:{"Content-type":"appliction/json"},credentials:"include"});if(n.ok)h.push(await n.json());else{const l=await n.json();h.push({testo:l.Error||"Something went wrong"}),console.log(l.Error)}}catch(n){h.push({testo:"Network error"}),console.log(n)}}}async function de(o,t){let e={id:t,valutazione:o};try{const n=await fetch(i+"/commento_post/valuta",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(e),credentials:"include"});if(n.ok)console.log(n);else{const l=await n.json();window.alert(l.Error||"Something went wrong")}}catch(n){window.alert("Network error"),console.log(n)}}async function we(o){let t={id:o};try{const e=await fetch(i+"/commento_post/segnala",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}async function ue(o){try{const t=await fetch(i+"/commento_post/"+o,{method:"DELETE",headers:{"Content-type":"application/json"},credentials:"include"});if(t.ok)console.log(t);else{const e=await t.json();window.alert(e.Error||"Something went wrong")}}catch(t){window.alert("Network error"),console.log(t)}}async function he(o){let t={id:o,testo:x.value};try{const e=await fetch(i+"/commento_post/modifica",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}export{D as A,B,X as C,f as D,j as E,Y as F,J as G,w as H,Z as I,g as J,q as K,I as L,se as M,v as N,$ as O,R as P,F as Q,te as R,m as S,Q as T,y as U,V,p as W,z as X,u as Y,ie as a,le as b,S as c,ce as d,de as e,oe as f,we as g,ue as h,x as i,he as j,E as k,s as l,ae as m,L as n,ee as o,h as p,O as q,A as r,re as s,C as t,T as u,ne as v,U as w,b as x,k as y,_ as z};
