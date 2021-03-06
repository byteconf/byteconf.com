const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const routes = [
    {
      fromPath: '/s/youtube',
      toPath: 'https://www.youtube.com/channel/UC046lFvJZhiwSRWsoH8SFjg',
    },
    {
      fromPath: '/s/instagram',
      toPath: 'https://instagram.com/bytesizedcode',
    },
    {
      fromPath: '/s/medium',
      toPath: 'https://medium.com/byteconf',
    },
    {
      fromPath: '/s/github',
      toPath: 'https://github.com/signalnerve/bytesized',
    },
    {
      fromPath: '/s/patreon',
      toPath: 'https://www.patreon.com/bytesizedcode/',
    },
    {
      fromPath: '/patrons',
      toPath: 'https://www.patreon.com/bytesizedcode/',
    },
    {
      fromPath: '/s/twitch',
      toPath: 'https://twitch.tv/byteconf',
    },
    {
      fromPath: '/discord',
      toPath: 'https://discordapp.com/invite/dTKdswv',
    },
    {
      fromPath: '/s/discord',
      toPath: 'https://discordapp.com/invite/dTKdswv',
    },
    {
      fromPath: '/s/newsletter',
      toPath: 'https://www.bytesized.xyz/newsletter',
    },
    {
      fromPath: '/s/blog',
      toPath: 'https://blog.byteconf.com',
    },
    {
      fromPath: '/s/twitter',
      toPath: 'https://twitter.com/bytesizedcode',
    },
    {
      fromPath: '/s/periscope',
      toPath: 'https://www.pscp.tv/byteconf',
    },
    {
      fromPath: '/sponsor',
      toPath: 'https://bytesized.typeform.com/to/wBXCdI',
    },
    {
      fromPath: '/sponsors',
      toPath: 'https://bytesized.typeform.com/to/wBXCdI',
    },
  ]

  routes.forEach(({ fromPath, toPath, redirectInBrowser = true }) => {
    createRedirect({
      fromPath,
      toPath,
      redirectInBrowser,
    })
  })

  return new Promise((resolve, reject) => {
    const eventTemplate = path.resolve(`src/templates/event.js`)
    const eventRSVPTemplate = path.resolve(`src/templates/eventRSVP.js`)
    const postTemplate = path.resolve(`src/templates/blogPost.js`)
    const tagTemplate = path.resolve(`src/templates/tag.js`)

    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allSanityEvent {
              edges {
                node {
                  slug
                }
              }
            }
            allGhostPost {
              edges {
                node {
                  slug
                }
              }
            }
            allGhostTag {
              edges {
                node {
                  name
                  slug
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        result.data.allGhostPost.edges.forEach(({ node: { slug } }) => {
          createPage({
            path: `/${slug}`,
            component: postTemplate,
            context: {
              slug,
            },
          })
        })

        result.data.allGhostTag.edges.forEach(({ node: { name, slug } }) => {
          createPage({
            path: `/${slug}`,
            component: tagTemplate,
            context: {
              name,
              slug,
            },
          })
        })

        // Create pages for each markdown file.
        result.data.allSanityEvent.edges.forEach(({ node: { slug } }) => {
          createPage({
            path: slug,
            component: eventTemplate,
            context: {
              slug,
            },
          })
          createPage({
            path: slug + '/thanks',
            component: eventRSVPTemplate,
            context: {
              slug,
            },
          })
        })
      })
    )
  })
}
