const axios = require('axios')

module.exports = function (api, opts) {
    api.loadSource(async store => {
        const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`);

        /* res.then(function (response) {
            console.log('Response 1 :', response);
          })
          .catch(function (error) {
            console.log(error);
          }); */

          console.log('Response 2 :', res);
        /* fetch('https://api.example.com/posts').then((response) => {
            // If error then exit
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }

            // Examine the text in the response
            this.articles = response.json();
            console.log('DATA :', this.articles);
            return this.articles;
        }); */

        /* const contentType = store.addContentType({
            typeName: 'BlogPosts44',
            route: 'blog/:slug'  // add this for one dynamic route...
        })

        for (const item of data) {
            contentType.addNode({
                id: item.id,
                title: item.title,
                path: `blog/${item.slug}` //... or this for a route per item
            })
        } */
    });
}
