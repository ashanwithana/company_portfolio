import type { PostFrontmatter } from '@/content/posts'

/**
 * A blog post module.
 *
 * Each post is its own file under `src/content/posts/`, exporting these
 * frontmatter fields plus a default component that renders the body. Keeping
 * prose in separate modules means the index only ever reads metadata.
 */
export type PostModule = PostFrontmatter & {
  default: () => React.ReactNode
}
