require(`dotenv`).config()

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

module.exports = {
  siteMetadata: {
    title: `Dan In Progress`,
    author: {
      name: `@DanInProgress`,
      summary: `Improving as I go`,
    },
    description: `Dan In Progress - Improving as I go.`,
    siteUrl: `https://daninprogress.com`,
    social: {
      github: `daninprogress`
    }
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/content/blog`,
      name: `blog`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`,
    },
  },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            maxWidth: 630,
          },
        },
        `gatsby-remark-mermaid`,
        `gatsby-remark-prismjs`,
        `gatsby-remark-copy-linked-files`,
        `gatsby-remark-smartypants`,
      ],
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title: title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
            allMarkdownRemark.nodes.map((post) => {
                console.log(post)
                const url = site.siteMetadata.siteUrl + post.fields.slug
                const content = `<p>${post.excerpt}</p><div style="margin-top: 50px; font-style: italic;"><strong><a href="${url}">Keep reading</a>.</strong></div><br /> <br />`

                return {
                  title: post.frontmatter.title,
                  date: post.frontmatter.date,
                  excerpt: post.excerpt,
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": content }],
                }
              }),
            query: `
              {
                allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
                  nodes {
                    frontmatter {
                      title
                      date(formatString: "MMMM D, YYYY")
                    }
                    excerpt
                    fields {
                      slug
                    }
                  }
                }
              }
            `,
            output: `rss.xml`,
            title: "Dan In Progress - Improving as I go"
          },
        ],
      },
    }
  ]   ,
}
