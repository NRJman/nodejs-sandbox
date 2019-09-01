import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientPost, ServerPost } from '../shared/post.model';
import { HttpClient } from '@angular/common/http';
import { PostsResponse } from '../shared/posts.response.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: ClientPost[] = [];
  private postsUpdated = new Subject<ClientPost[]>();

  constructor(private http: HttpClient) { }

  addPost(title: string, content: string): void {
    const post: ClientPost = {
      id: null,
      title,
      content
    };

    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
    this.storePostsOnServer('POST', post)
      .subscribe((response) => {
        console.log();
      });
  }

  updatePost(id: string, title: string, content: string): void {
    console.log(arguments);
  }

  fetchPosts(): Observable<PostsResponse> {
    return this.http.get<PostsResponse>('http://localhost:3000/api/posts')
      .pipe(
        map((response: PostsResponse) => {
          return {
            ...response,
            posts: response.posts.map((post: ServerPost) => ({
              ...post,
              id: post._id
            }))
          };
        })
      );
  }

  storePostsOnServer(method: 'POST' | 'PUT', post: ClientPost): Observable<PostsResponse> {
    return this.http.post<PostsResponse>('http://localhost:3000/api/posts', post);
  }

  deletePostOnServer(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
  }

  storePostsLocally(posts: ClientPost[]): void {
    this.posts = posts;
    this.postsUpdated.next([...this.posts]);
  }

  deletePostLocally(targetId: string): void {
    const posts = this.posts;

    for (let i = 0, len = posts.length; i < len; i++) {
      if (posts[i].id === targetId) {
        posts.splice(i, 1);
        this.postsUpdated.next([...this.posts]);
        break;
      }
    }
  }

  getPosts(): ClientPost[] {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
