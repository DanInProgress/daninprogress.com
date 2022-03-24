const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const DEVMODE = false

function findFromIndex(arr, start, increment, get) {
    for (let i = start; i > -1 && i < arr.length; i = i + increment) {
        const v = get(arr[i])
        if (v !== undefined) {
            return v
        }
    }
    return null
}

exports.createPages = async({ graphql, actions, reporter }) => {
    const { createPage } = actions

    // Define a template for blog post
    const blogPost = path.resolve(`./src/templates/blog-post.tsx`)

    // Get all markdown blog posts sorted by date
    const result = await graphql(
        `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              published
            }
          }
        }
      }
    `
    )

    if (result.errors) {
        reporter.panicOnBuild(
            `There was an error loading your blog posts`,
            result.errors
        )
        return
    }

    const posts = result.data.allMarkdownRemark.nodes

    // Create blog posts pages
    // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
    // `context` is available in the template as a prop and as a variable in GraphQL

    if (posts.length > 0) {
        posts.forEach((post, index) => {
            const previousPostId = findFromIndex(posts, index - 1, -1,
                (p) => ((p.frontmatter.published === true) || DEVMODE) ? p.id : undefined)
            const nextPostId = findFromIndex(posts, index + 1, 1,
                (p) => ((p.frontmatter.published === true) || DEVMODE) ? p.id : undefined)
            createPage({
                path: post.fields.slug,
                component: blogPost,
                context: {
                    id: post.id,
                    previousPostId,
                    nextPostId,
                },
            })
        })
    }
}

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

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions

    // Explicitly define the siteMetadata {} object
    // This way those will always be defined even if removed from gatsby-config.js

    // Also explicitly define the Markdown frontmatter
    // This way the "MarkdownRemark" queries will return `null` even when no
    // blog posts are stored inside "content/blog" instead of returning an error
    createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      title: String
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}