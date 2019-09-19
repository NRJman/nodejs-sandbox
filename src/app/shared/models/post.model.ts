export interface Post {
  title: string;
  content: string;
  imageSrc?: string;
}

export interface PostUpdated {
  title?: string;
  content?: string;
  imageSrc?: string;
}

export interface PostsList {
  [id: string]: Post;
}
