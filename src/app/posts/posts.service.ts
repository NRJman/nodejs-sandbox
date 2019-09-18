import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Post } from '../shared/models/post.model';
import { HttpClient } from '@angular/common/http';
import { PostsResponse } from '../shared/models/posts.response.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private _postsListPendingUpdated$$: Subject<boolean> = new Subject<boolean>();
  private _postsListPending: boolean;
  private posts: Post[] = [];
  private postsUpdated$$: Subject<Post[]> = new Subject<Post[]>();
  private exactPostUpdated$$: Subject<Observable<PostsResponse>> = new Subject<Observable<PostsResponse>>();
  private postsAPIServerURL = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient) { }

  addPost(post: Post): void {
    this.posts.push(post);
    this.postsUpdated$$.next(this.getPosts());
  }

  fetchPosts(): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(this.postsAPIServerURL);
  }

  storePostOnServer(title: string, content: string, image: File): Observable<PostsResponse> {
    const formData: FormData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    return this.http.post<PostsResponse>(this.postsAPIServerURL, formData);
  }

  deletePostOnServer(id: string) {
    return this.http.delete(this.postsAPIServerURL + id);
  }

  updateExactPostOnServer(id: string, title: string, content: string): void {
    this.exactPostUpdated$$.next(
      this.http.patch<PostsResponse>(this.postsAPIServerURL + id, { id, title, content })
    );
  }

  storePostsLocally(posts: Post[]): void {
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

  updateExactPostLocally({ id, title, content }: Post): void {
    const posts: Post[] = this.posts;

    for (let i = 0, len = posts.length; i < len; i++) {
      if (posts[i].id === id) {
        posts[i].title = title;
        posts[i].content = content;

        return;
      }
    }
  }

  set postsListPending(isPostsListPending: boolean) {
    if (isPostsListPending) {
      this._postsListPendingUpdated$$.next(true);
    } else {
      this._postsListPendingUpdated$$.next(false);
    }

    this._postsListPending = isPostsListPending;
  }

  getPosts(): Post[] {
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

  get postsListPending(): boolean {
    return this._postsListPending;
  }

  get postsListPendingUpdated$(): Observable<boolean> {
    return this._postsListPendingUpdated$$.asObservable();
  }
}
