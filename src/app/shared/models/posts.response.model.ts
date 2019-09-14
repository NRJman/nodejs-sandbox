import { Post } from './post.model';

export interface PostsResponse {
    message: string;
    posts?: Post[];
    post?: Post;
    id?: string;
}