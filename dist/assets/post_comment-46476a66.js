import{j as a,k as d}from"./index-ba19e415.js";const T={}.VITE_API_HOST||"https://epiopera-4f1c76fdd577.herokuapp.com/",r=T+"/api",O=a("Ilcalmissimo"),C=a("Cotoletta.123"),U=a(""),k=a(""),_=a(""),b=a(""),B=a(""),j=a(""),J=a(""),m=a(""),I=d([]),u=a(""),f=a(""),w=a(""),p=a("");async function A(){s.username!=null&&(I.values=await(await fetch(r+"/utente/"+s.username,{credentials:"include"})).json())}function V(){fetch(r+"/utente/login",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:O.value,password:C.value})}).then(async t=>{if(t.ok){const o=await t.json();N(o),document.cookie=`tokenEpiOpera=${o.token}`,m.value=""}else{const o=await t.json();m.value=o.Error||"Credentials are incorrect"}}).catch(t=>{m.value="Network error",console.log(t)})}function z(){if(k.value!==_.value){u.value="Password does not match";return}let t={username:U.value,email:b.value,password:k.value,utenti_seguiti:[],post_favoriti:[]};fetch(r+"/utente",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"}).then(async o=>{if(o.ok){const e=await o.json();N(e),document.cookie=`tokenEpiOpera=${e.token}`,u.value=""}else{const e=await o.json();u.value=e.Error||"Something went wrong"}}).catch(o=>{u.value="Network error",console.log(o)})}function D(){fetch(r+"/utente/logout",{method:"PUT",headers:{"Content-Type":"application/json"}}).then(()=>{L(),document.cookie="tokenEpiOpera=; Max-Age=-99999999"}).catch(t=>console.error(t))}async function q(){let t="Are you sure you want to delete this account?";window.confirm(t)==!0&&(await fetch(r+"/utente/"+s.username,{method:"DELETE",headers:{"Content-type":"application/json"},credentials:"include"}).then(async o=>{if(!o.ok){const e=o.json();window.alert(e.Error||"Something went wrong");return}}).catch(o=>{window.alert("Network error"),console.log(o)}),D())}async function Q(t){let o="Are you sure you want to delete this post?";window.confirm(o)==!0&&(await fetch(r+"/post/"+t,{method:"DELETE",headers:{"Content-type":"application/json"},credentials:"include"}).then(async e=>{if(!e.ok){const n=e.json();window.alert(n.Error||"Something went wrong");return}}).catch(e=>{window.alert("Network error"),console.log(e)}),P())}function X(){let t={email:B.value};fetch(r+"/utente/modificaMail",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"}).then(async o=>{if(o.ok)f.value="Email changed succesfully!";else{const e=await o.json();f.value=e.Error||"Somwthing went wrong"}}).catch(o=>{f.value="Network error",console.log(o)})}async function Y(){if(j.value!==J.value){w.value="Password does not match";return}let t={newPassword:j.value};fetch(r+"/utente/modificaPassword",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"}).then(async o=>{if(o.ok)w.value="Password changed succesfully!";else{const e=await o.json();w.value=e.Error||"Something went wrong"}}).catch(o=>{w.value="Network error",console.log(o)})}function Z(){let t={nsfw:nsfw.value};fetch(r+"/utente/modificaNSFW",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(t),credentials:"include"}).then(async o=>{if(o.ok)p.value="NSFW setting changed succesfully!";else{const e=await o.json();p.value=e.Error||"Something went wrong"}}).catch(o=>{p.value="Network error",console.log(o)})}async function ee(t){let o={utenteDaSeguire:t};try{const e=await fetch(r+"/utente/segui",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}A()}const s=d({token:void 0,username:void 0,self:void 0});function N(t){s.token=t.token,s.username=t.username,s.self=t.self}function L(){s.token=void 0,s.username=void 0,s.self=void 0}const H={}.VITE_API_HOST||"https://epiopera-4f1c76fdd577.herokuapp.com/",c=H+"/api",K=d([]),y=d([]),v=d([]),F=a(""),G=a(""),M=a(""),g=a(""),$=a("");async function oe(t,o){let e={id:t,titolo:F.value,testo:G.value,tag:M.value.split(" "),media:o};try{const n=await fetch(c+"/post/modifica",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(e),credentials:"include"});if(n.ok)g.value="Success",P();else{const l=await n.json();g.value=l.Error||"Something went wrong"}}catch(n){g.value="Network error",console.log(n)}}async function te(){try{const t=await fetch(c+"/posts",{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(t.ok)K.values=await t.json();else{const o=await t.json();window.alert(o.Error||"Something went wrong")}}catch(t){window.alert("Network error"),console.log(t)}}async function P(){if(s.username!=null)try{const t=await fetch(c+"/post/user/"+s.username,{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(t.ok)y.values=await t.json();else{const o=await t.json();window.alert(o.Error||"Something went wrong"),y.values=[]}}catch(t){window.alert("Network error"),console.log(t),y.values=[]}}async function ne(t,o){console.log("id: "+o+`
score: `+t+`
token: `+s.token);const e={id:o,valutazione:t};await fetch(c+"/post/valuta",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(e),credentials:"include"}).then(n=>{console.log(n.headers.get("set-cookie"))}).catch(n=>{console.log(n)})}async function ae(t){const o={id:t};try{const e=await fetch(c+"/post/segnala",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"});if(e.ok)console.log(await e.json());else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Something went wrong"),console.log(e)}}async function se(t){console.log(t),v.splice(0);for(const o of t)try{const e=await fetch(c+"/post/id/"+o,{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(e.ok)v.push(await e.json());else{const n=await e.json();$.value=n.Error||"Something went wrong",console.log(n.Error)}}catch(e){v.push({titolo:"Netwrok error"}),console.log(e)}}async function re(t){let o={id:t};try{const e=await fetch(c+"/post/salvaNeiFavoriti",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}function ie(t){if(t.startsWith("commento")){let e=document.getElementsByName("commento");for(let n of e)t!=n.id&&(n.style.display="none")}let o=document.getElementById(t);t==="settings"?(f.value="",w.value="",p.value=""):g.value="",o.style.display==="none"?o.style.display="block":o.style.display="none"}const x={}.VITE_API_HOST||"https://epiopera-4f1c76fdd577.herokuapp.com/",i=x+"/api",h=d([]),S=a(""),W=a(""),E=a("");async function ce(t){let o={id_post:t,testo:E.value};E.value="";try{const e=await fetch(i+"/commento_post",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();console.log(e),window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}async function le(t){let o=[];h.splice(0);try{const e=await fetch(i+"/commento_post/all/"+t,{method:"GET",headers:{"Content-type":"application/json"},credentials:"include"});if(e.ok)o=await e.json();else{const n=await e.json();S.value=n.Error||"Something went wrong",o=[]}}catch(e){S.value="Network error",console.log(e),o=[]}for(const e of o){console.log("fetching post "+e);try{const n=await fetch(i+"/commento_post/"+e,{method:"GET",headers:{"Content-type":"appliction/json"},credentials:"include"});if(n.ok)h.push(await n.json());else{const l=await n.json();h.push({testo:l.Error||"Something went wrong"}),console.log(l.Error)}}catch(n){h.push({testo:"Network error"}),console.log(n)}}}async function de(t,o){let e={id:o,valutazione:t};try{const n=await fetch(i+"/commento_post/valuta",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(e),credentials:"include"});if(n.ok)console.log(n);else{const l=await n.json();window.alert(l.Error||"Something went wrong")}}catch(n){window.alert("Network error"),console.log(n)}}async function we(t){let o={id:t};try{const e=await fetch(i+"/commento_post/segnala",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}async function ue(t){try{const o=await fetch(i+"/commento_post/"+t,{method:"DELETE",headers:{"Content-type":"application/json"},credentials:"include"});if(o.ok)console.log(o);else{const e=await o.json();window.alert(e.Error||"Something went wrong")}}catch(o){window.alert("Network error"),console.log(o)}}async function he(t){let o={id:t,testo:W.value};try{const e=await fetch(i+"/commento_post/modifica",{method:"PUT",headers:{"Content-type":"application/json"},body:JSON.stringify(o),credentials:"include"});if(e.ok)console.log(e);else{const n=await e.json();window.alert(n.Error||"Something went wrong")}}catch(e){window.alert("Network error"),console.log(e)}}export{D as A,B,X as C,f as D,j as E,Y as F,J as G,w as H,Z as I,p as J,q as K,I as L,se as M,v as N,F as O,G as P,M as Q,oe as R,g as S,Q as T,y as U,V,m as W,z as X,u as Y,ie as a,le as b,E as c,ce as d,de as e,te as f,we as g,ue as h,W as i,he as j,S as k,s as l,ae as m,K as n,ee as o,h as p,P as q,A as r,re as s,C as t,O as u,ne as v,U as w,b as x,k as y,_ as z};
