<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="EpiOpera logo" class="logo" src="./assets/logo.png" width="150" height="150" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/posts">Home</RouterLink>
        <RouterLink to="/user">Search User</RouterLink>
        <RouterLink to="/login">Your Profile</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 2;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: top;
    background-color: black;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    margin: auto;
  }

  nav > * {
    margin: 25px;
    font-size: larger;
  }
}
</style>
