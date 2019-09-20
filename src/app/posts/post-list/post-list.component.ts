import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post, PostsList } from '../../shared/models/post.model';
import { PostsService } from '../posts.service';
import { PostsResponse } from '../../shared/models/posts.response.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public posts: PostsList;
  public postsIds: string[] = [];
  public postsListPending: boolean = this.postsService.postsListPending;
  public totalPostsListLength: number;
  public pageSize = 2;
  public pageSizeOptions: number[] = [2, 5, 10];

  constructor(
    public postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  onPostDelete(idToDelete: string): void {
    this.postsService.deletePostOnServer(idToDelete)
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({ id }: PostsResponse) => {
        this.postsService.deletePostLocally(id);
      });
  }

  onPostEdit(id: string): void {
    this.router.navigate(['/edit-post', id]);
  }

  onPaginatorDataChange(event): void {
    console.log(event);
  }

  ngOnInit(): void {
    this.totalPostsListLength = this.route.snapshot.data.postsListLength;

    this.handleInitialSubscriptions();
    this.preloadPosts();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private preloadPosts(): void {
    this.posts = this.postsService.getPosts();
    this.postsIds = this.postsService.getPostsIds();

    if (!this.postsIds.length) {
      this.postsService.postsListPending = true;

      this.postsService.fetchPostsInitially()
        .pipe(
          takeUntil(this.subscriptionController$$)
        )
        .subscribe((response: PostsResponse) => {
          this.postsService.storePostsLocally(response.posts);
          this.posts = this.postsService.getPosts();
          this.postsIds = this.postsService.getPostsIds();
          this.postsService.postsListPending = false;
        });
    }
  }

  private handleInitialSubscriptions(): void {
    this.postsService.postsListPendingUpdated$
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((isPostsListPending: boolean) => {
        this.postsListPending = isPostsListPending;
      });

    this.postsService.getPostsUpdateListener()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((posts: PostsList) => {
        this.posts = posts;
        this.postsIds = Object.keys(posts);
      });
  }
}
