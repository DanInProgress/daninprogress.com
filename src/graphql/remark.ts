
export type BaseMarkdownRemark = {
    frontmatter?: Map<string,string> & {
        title?: string
        description?: string
        date?: string
        tags?: Array<string>
    }
    html?: string
    excerpt?: string
    fields?: {
        slug?: string
    }
}
