import * as React from "react"
import { Link,graphql } from "gatsby"
import Bio from "./bio"

import "../article.css"
import Callout from "./callout"

type BlogPostProp = {
    frontmatter: any
    title: string
    slug?: string
    date?: string
    tags?: Array<string>
    previewOnly?: boolean
    excerptHtml?: string
    html?: string
}

const BlogPost = (props:BlogPostProp) => (
    props.previewOnly || (! props.html)?
        Excerpt(props) : Post(props)
)


const Excerpt = ({title, date, excerptHtml, slug}:BlogPostProp) => (
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
    <span className="publication-date">{date}</span>
    <p className="article-text"
      dangerouslySetInnerHTML={{
        __html: excerptHtml || "",
      }}
      itemProp="description"
    />
    <Link to={slug||"#"} className="read-more" >Read Article</Link>
  </article>
)

const Post = ({title, tags, slug, html}:BlogPostProp) => (
    <article
    itemScope
    itemType="http://schema.org/Article"
    >
    <h1>
        <Link to={slug || "#"} itemProp="url">
        <span itemProp="headline">{title}</span>
        </Link>
    </h1>
    {tags?.map((v:string)=>{
      switch(v) {
        case "under-construction":
            return (<Callout type="construction" >
                      {"I'm still working on this post, feel free to read it over and give me feedback :)"}
                    </Callout>)
      }
      return undefined
    })}
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
