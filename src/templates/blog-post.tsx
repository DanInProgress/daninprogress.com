import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

import { BaseMarkdownRemark } from "../graphql/remark"

import { SiteMetadata } from "../graphql/site"
import BlogPost from "../components/blog-post"

type AdjacentPostSlugs = BaseMarkdownRemark &{
  frontmatter: {
    title: any
  }
  fields: {
    slug : any
  }
}

type BlogPostData = {
  markdownRemark: BaseMarkdownRemark & {
    frontmatter: {
      title: any
      description: any
      date: any
    }
  }
  site: SiteMetadata
  previous: AdjacentPostSlugs
  next: AdjacentPostSlugs
}

const BlogPostTemplate = ({ data, location }:{data: BlogPostData, location: URL}) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <BlogPost 
        frontmatter={post.frontmatter}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        html={post.html}
        tags={post.frontmatter.tags}
      />
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        construction
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
