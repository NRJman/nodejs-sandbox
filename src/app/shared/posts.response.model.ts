import { ServerPost } from './post.model';

export interface PostsResponse {
    message: string;
    posts?: ServerPost[];
}
