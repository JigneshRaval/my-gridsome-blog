---
title: Building a blog with Gridsome - Creating the Blog
date: 2019-02-06
published: true
tags: ['Gridsome','Static site generator', 'Blog']
canonical_url: false
description: "Markdown is intended to be as easy-to-read and easy-to-write as is feasible. Readability, however, is emphasized above all else. A Markdown-formatted document should be publishable as-is, as plain text, without looking like it's been marked up with tags or formatting instructions."
---


Gridsome is the Gatsby alternative for Vue.js that aims to provide the tech stack to build blazing fast statically generated websites. It’s data-driven, using a GraphQL layer to get data from different sources in order to dynamically generate pages from it.

A few days ago I announced Gridsome on Twitter as soon as I heard about it. It’s a project built by the brothers Tommy Vedvik and Hans-Jørgen Vedvik (could they be the next Nuxt brothers?).

It has special focus on web performance, applying the PRPL pattern in order to achieve fast time to interactive (TTI) and therefore great scores in Lighthouse.

I’m pretty sure you’re as excited as I am, so let’s see how we can build a simple blog with Gridsome!

$ npm install --global @gridsome/cli
$ gridsome create my-awesome-blog
Now you can go to my-awesome-blog and run npm run develop to start building the blog.

Folder Structure
If you go to the src folder created, you’ll see that it’s no much different than with a usual Vue app.

Similar to the way Nuxt.js works, Gridsome has pages and layouts.

Pages are the Vue components that define the pages of the website, and their folder structure determine the routes created. For instance, by default you have pages/Index.vue and pages/About.vue, that will end up creating the / and /about routes.

If you take a look at any of the pages, you’ll see they are wrapped in a <Layout> component, which is the default layout registered in main.js. Take a look at the layout docs to find more info.

Config
Another important piece is the gridsome.config.js file, where you can configure many aspects of a Gridsome app.

A basic configuration may look like this:

```
gridsome.config.js

module.exports = {
  siteName: "Alligator",
  siteUrl: "https://alligator.io",
  siteDescription: "Learn about it on Alligator.io! 🐊",
  icon: "src/alligator-favicon.png",
  plugins: []
};
```

You can see some metadata properties, as well as a plugins option that we’re about to use.

See the config docs to find all the config options.

Building a Blog
Enough said, let’s get a real blog started!

For the blog, we’d like to write the posts in markdown, so that a page is created for each markdown file.

We can’t use Gridsome’s pages for it, since they have a specific path based on their folder structure. Instead, we want to dynamically generate a page per post.

For that, we need to use the source-filesystem plugin which takes local files as source of data, creates routes for them and adds their data to the GraphQL layer.

In order to understand the markdown content, it also needs transformer-remark. Let’s install both:

$ npm install --save-dev @gridsome/source-filesystem @gridsome/transformer-remark
And add the following config to gridsome.config.js:

gridsome.config.js

module.exports = {
  transformers: {
    remark: {}
  },

  plugins: [
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "blog/**/*.md",
        typeName: "Post"
      }
    }
  ]
};
As you can see, the options talk for themselves, but the important ones for us here are:

path: we’re telling it to grab the markdown posts from the blog folder. It’ll create a route given the path of the file (for blog/crazy-post.md the path will be /blog/crazy-post)
typeName: that’s the GraphQL entity that will be created
Creating the Post template
Gridsome uses templates to define how these dynamically generated pages will be rendered.

The template we create for the post must match the typeName option we’ve just set. So, let’s create templates/Post.vue with the following content:

templates/Post.vue

<template>
  <Layout>
    <div v-html="$page.post.content"/>
  </Layout>
</template>

<page-query>
query Post ($path: String!) {
  post: post (path: $path) {
    title
    content
  }
}
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$page.post.title
    };
  }
};
</script>
The outstanding thing here is the <page-query> tag… What’s that?

If you remember, Gridsome uses a GraphQL layer to access the data, and the @gridsome/source-filesystem plugin is filling it with the posts found.

What’s even more amazing, is that you can access a whole GraphQL playground at http://localhost:8080/___explore, so you can explore the schema and try your queries in there!

GraphQL Playground

As soon as you have your query ready, you can place it in the <page-query> tag, which accepts a $path variable in order to query the right post.

The result of that query will be placed within the $page instance property. In that way, we can insert the post content using <div v-html="$page.post.content"/>.

Isn’t that cool?

Another outstanding point is the metaInfo computed property. That’s in there because Gridsome uses vue-meta, so you have full control on the meta info for SEO, social media and metadata purposes, and you can use $page to access the post data.

Finally, create a blog/awesome-article.md with some random content:

blog/awesome-article.md

---
title: An awesome article
---

## An awesome article

This is some **awesome** content for a crazy sample blog
Now, thanks to hot reloading, the article should be available at http://localhost:8080/blog/awesome-post

Gridsome Blog Running

Wrapping Up
So far we’ve seen how to get started with Gridsome, as well as installing and using plugins in order to connect with different types of source data.

Stay tuned for the second part of this article to see how to extend our blog with a paginated page that lists the blog’s posts.
