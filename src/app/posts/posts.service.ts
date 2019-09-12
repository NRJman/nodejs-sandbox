import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ClientPost, ServerPost } from '../shared/models/post.model';
import { HttpClient } from '@angular/common/http';
import { PostsResponse } from '../shared/models/posts.response.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: ClientPost[] = [];
  private postsUpdated$$ = new Subject<ClientPost[]>();
  private exactPostUpdated$$ = new Subject<Observable<PostsResponse>>();
  private postsAPIServerURL = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient) { }

  addPost(title: string, content: string): void {
    const post: ClientPost = {
      id: null,
      title,
      content
    };

    this.posts.push(post);
    this.postsUpdated$$.next([...this.posts]);
    this.storePostsOnServer('POST', post)
      .subscribe((response) => {
        console.log();
      });
  }

  fetchPosts(): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(this.postsAPIServerURL)
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
    return this.http.post<PostsResponse>(this.postsAPIServerURL, post);
  }

  deletePostOnServer(id: string) {
    return this.http.delete(this.postsAPIServerURL + id);
  }

  updateExactPostOnServer(id: string, title: string, content: string): void {
    this.exactPostUpdated$$.next(
      this.http.patch<PostsResponse>(this.postsAPIServerURL + id, { id, title, content })
    );
  }

  storePostsLocally(posts: ClientPost[]): void {
    this.posts = posts;
    this.postsUpdated$$.next([...this.posts]);
  }

  deletePostLocally(targetId: string): void {
    const posts = this.posts;

    for (let i = 0, len = posts.length; i < len; i++) {
      if (posts[i].id === targetId) {
        posts.splice(i, 1);
        this.postsUpdated$$.next([...this.posts]);
        break;
      }
    }
  }

  updateExactPostLocally({ id, title, content }: ClientPost): void {
    const posts: ClientPost[] = this.posts;

    for (let i = 0, len = posts.length; i < len; i++) {
      if (posts[i].id === id) {
        posts[i].title = title;
        posts[i].content = content;

        return;
      }
    }
  }

  getPosts(): ClientPost[] {
    return [...this.posts];
  }

  getPostsUpdateListener() {
    return this.postsUpdated$$.asObservable();
  }

  getExactPostUpdateListener() {
    return this.exactPostUpdated$$.asObservable()
      .pipe(
        switchMap((putRequest: Observable<PostsResponse>) => putRequest)
      );
  }
}
