// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
    siteName: 'Gridsome Blog Starter',
    siteDescription: 'A simple, hackable & minimalistic starter for Gridsome that uses Markdown for content.',
    plugins: [
        {
            use: '@gridsome/source-filesystem',
            options: {
                index: ['README'],
                // path: 'blog/**/*.md',
                path: 'content/posts/*.md',
                typeName: 'Post',
                route: '/blog/:slug',
                refs: {
                    // Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
                    tags: {
                        typeName: 'Tag',
                        route: '/tag/:id',
                        create: true
                    }
                }
            }
        },
        /* {
            use: '~/src/products',
            options: {
                apiKey: '',
                base: '',
            },
        }, */
    ],
    transformers: {
        //Add markdown support to all file-system sources
        remark: {
            externalLinksTarget: '_blank',
            externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
            anchorClassName: 'icon icon-link',
            plugins: [
                '@gridsome/remark-prismjs'
            ]
        }
    },
}
