import { Post, PostUpdated } from './post.model';

export interface PostsResponse {
    message: string;
    posts?: { [id: string]: Post };
    post?: Post;
    postUpdated?: PostUpdated;
    id?: string;
    postsListLength?: number;
}
