import { ServerPost } from './post.model';

export interface PostsResponse {
    message: string;
    posts?: ServerPost[];
    id?: string;
    title?: string;
    content?: string;
}
