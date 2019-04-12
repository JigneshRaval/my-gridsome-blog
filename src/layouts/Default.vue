<!--<template>
  <div class="layout">
    <header class="header">
      <strong>
        <g-link to="/">{{ $static.metaData.siteName }}</g-link>
      </strong>
      <nav class="nav">
        <g-link class="nav__link" to="/">Home</g-link>
        <g-link class="nav__link" to="/about">About</g-link>
      </nav>
    </header>
    <slot/>
  </div>
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.nav__link {
  margin-left: 20px;
}
</style>-->

<template>
  <div id="app">
    <header class="header">
      <div class="header__left">
        <Logo v-if="showLogo"/>
      </div>

      <div class="header__right">
        <ToggleTheme/>
      </div>
    </header>

    <main class="main">
      <Posts />
      <slot/>
    </main>

    <footer class="footer">
      <span class="footer__copyright">Copyright © {{ new Date().getFullYear() }}.</span>
      <span class="footer__links">
        Powered by
        <a href="//gridsome.org">Gridsome</a>
      </span>
    </footer>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
import ToggleTheme from "../components/ToggleTheme.vue";
import Posts from "../components/Posts.vue";
export default {
  props: {
    showLogo: { default: true }
  },
  components: {
    Logo,
    ToggleTheme,
    Posts
  }
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  padding: 0 calc(var(--space) / 2);
  top: 0;
  z-index: 10;
  &__left,
  &__right {
    display: flex;
    align-items: center;
  }
  @media screen and (min-width: 1300px) {
    //Make header sticky for large screens
    position: sticky;
    width: 100%;
  }
}
.main {
  margin: 0 auto;
  padding: 1.5vw 15px 0;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--space) / 2);
  text-align: center;
  font-size: 0.8em;
  > span {
    margin: 0 0.35em;
  }
  a {
    color: currentColor;
  }
}
</style>
