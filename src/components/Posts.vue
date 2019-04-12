<template>
  <!-- List posts -->
  <div class="posts">
    <!-- <span class="logo__text">&larr; {{ $static.metaData.siteName }}</span> -->
    <!-- <PostCard v-for="edge in $page.posts.edges" :key="edge.node.id" :post="edge.node"/> -->
    <p v-for="edge in $static.posts.edges" :key="edge.node.id">
      <g-link :to="edge.node.path">{{edge.node.title}}</g-link>
    </p>
  </div>
</template>

<!-- Static Query can be used to create query from any component -->
<static-query>
{
  posts: allPost {
    edges {
      node {
        id
        title
        path
      }
    }
  }
}
</static-query>

<script>
export default {};
</script>
