import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"

import "../normalize.css"
import "../style.css"

import Seo from "../components/seo"
import BlogPost from "../components/blog-post"

const BlogIndex = ({ data, location }:any) => {
  const siteTitle = data.site.siteMetadata.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <h1>All Posts</h1>
      <ol className="post-list" >
        {posts.map((post:any) => {
          if(post.frontmatter.published !== true){
            return null
          }
          const title = post.frontmatter.title || post.fields.slug
          return (
            <li key={post.fields.slug}>
              <BlogPost
                title={post.frontmatter.title}
                date={post.frontmatter.date}
                slug={post.fields.slug}
                excerptHtml={post.frontmatter.description || post.excerpt}
              />
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          published
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
