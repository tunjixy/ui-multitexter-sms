export interface Post {
  author_name: string
  content: string
  created_at: string
  created_by: number
  featured_image: string
  featured_image_url: string
  id: number
  is_published: number
  published_at: string
  slug: string
  title: string
  updated_at: string
  updated_by: number
}

export interface PostsRes {
  data: Post[]
  page: number
  rows: number
  status: number
  total: number
  defaultpath: string
}

export interface PostRes {
  data: Post
  status: number
}
