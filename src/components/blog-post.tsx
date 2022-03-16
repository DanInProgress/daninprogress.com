import * as React from "react"
import { Link,graphql } from "gatsby"
import Bio from "./bio"

type BlogPostProp = {
    title: string
    slug?: string
    date?: string
    previewOnly?: boolean
    excerptHtml?: string
    html?: string
}

const BlogPost = (props:BlogPostProp) => (
    props.previewOnly || (! props.html)?
        Excerpt(props) : Post(props)
)


const Excerpt = ({title, excerptHtml, slug}:BlogPostProp) => (
    <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
    >
    <h2>
        <Link to={slug||"#"} itemProp="url">
          <span itemProp="headline">{title}</span>
        </Link>
    </h2>
    <span className="article-text"
      dangerouslySetInnerHTML={{
        __html: excerptHtml || "",
      }}
      itemProp="description"
    />
  </article>
)

const Post = ({title, slug, html}:BlogPostProp) => (
    <article
    className="post-list-item"
    itemScope
    itemType="http://schema.org/Article"
    >
    <h1>
        <Link to={slug || "#"} itemProp="url">
        <span itemProp="headline">{title}</span>
        </Link>
    </h1>
    <span className="article-text"
    dangerouslySetInnerHTML={{
        __html: html || "",
    }}
    itemProp="description"
    />
    <hr />
        <footer>
          <Bio />
        </footer>
    </article>
)

export default BlogPost
