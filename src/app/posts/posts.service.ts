import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Post } from '../shared/post.model';
import { HttpClient } from '@angular/common/http';
import { PostsResponse } from '../shared/posts.response.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  fetchPosts(): Observable<PostsResponse> {
    return this.http.get<PostsResponse>('http://localhost:3000/api/posts');
  }

  storePostsLocally(posts: Post[]): void {
    this.posts = posts;
    this.postsUpdated.next([...this.posts]);
  }

  storePostsOnServer(method: 'POST' | 'PUT', payload: Post): Observable<PostsResponse> {
    return this.http.post<PostsResponse>('http://localhost:3000/api/posts', payload);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string): void {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
    this.storePostsOnServer('POST', post)
      .subscribe((response) => {
        console.log();
      });
  }
}
