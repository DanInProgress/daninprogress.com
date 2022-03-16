
export type SiteMetadata = {
    siteMetadata: {
        title?: string,
        author?: {
          name?: string,
          summary?: string,
        },
        description?: string,
        siteUrl?: string,
        social?: {
          github?: string
        }
    }
}