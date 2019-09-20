import { Injectable, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Post, PostUpdated, PostsList } from '../shared/models/post.model';
import { HttpClient } from '@angular/common/http';
import { PostsResponse } from '../shared/models/posts.response.model';
import { POSTS_API_SERVER_URL_TOKEN } from '../app.config';

@Injectable({providedIn: 'root'})
export class PostsService {
  private _postsListPendingUpdated$$: Subject<boolean> = new Subject<boolean>();
  private _postsListPending = false;
  private posts: PostsList = {};
  private postsIds: string[] = [];
  private postsUpdated$$: Subject<PostsList> = new Subject<PostsList>();
  private exactPostUpdated$$: Subject<Observable<PostsResponse>> = new Subject<Observable<PostsResponse>>();

  constructor(
    private http: HttpClient,
    @Inject(POSTS_API_SERVER_URL_TOKEN) private postsAPIServerURL: string
  ) { }

  addPost(id: string, post: Post): void {
    this.posts[id] = post;
    this.postsUpdated$$.next(this.getPosts());
  }

  fetchPostsInitially(): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(this.postsAPIServerURL);
  }

  fetchPosts(
    currentPage: number,
    targetPage: number,
    firstPostIdOnCurrentPage: string,
    pageSize: number
  ): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(this.postsAPIServerURL, {
      params: {
        currentPageIndex: String(currentPage),
        targetPageIndex: String(targetPage),
        firstPostIdOnCurrentPage,
        pageSize: String(pageSize)
      }
    });
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

  updateExactPostOnServer(
    id: string,
    fieldsToUpdate: { title?: string, content?: string, image?: File } | null
  ): void {
    const formData: FormData = new FormData();

    for (const fieldName in fieldsToUpdate) {
      if (fieldsToUpdate[fieldName]) {
        formData.append(fieldName, fieldsToUpdate[fieldName]);
      }
    }

    this.exactPostUpdated$$.next(
      this.http.patch<PostsResponse>(this.postsAPIServerURL + id, formData)
    );
  }

  storePostsLocally(posts: PostsList): void {
    this.posts = posts;
    this.postsIds = Object.keys(posts);
    this.postsUpdated$$.next({ ...posts });
  }

  deletePostLocally(targetId: string): void {
    const posts = this.posts;

    delete posts[targetId];
    this.postsUpdated$$.next({ ...posts });
  }

  updateExactPostLocally(id: string, postUpdated: PostUpdated): void {
    const posts: PostsList = this.posts;

    posts[id] = {
      ...posts[id],
      ...postUpdated
    };
  }

  set postsListPending(isPostsListPending: boolean) {
    if (isPostsListPending) {
      this._postsListPendingUpdated$$.next(true);
    } else {
      this._postsListPendingUpdated$$.next(false);
    }

    this._postsListPending = isPostsListPending;
  }

  getPosts(): PostsList {
    return { ...this.posts };
  }

  getPostsIds(): string[] {
    return [...this.postsIds];
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
