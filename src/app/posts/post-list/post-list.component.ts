import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post, PostsList } from '../../shared/models/post.model';
import { PostsService } from '../posts.service';
import { PostsResponse } from '../../shared/models/posts.response.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';
import { PostsListPaginationService } from './posts-list-pagination.service';
import { PaginationData } from 'src/app/shared/models/pagination-data.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public posts: PostsList;
  public postsIds: string[] = [];
  public postsListPending: boolean = this.postsService.postsListPending;
  public paginationData: PaginationData;
  public pageSizeOptions: number[] = [2, 5, 10];

  constructor(
    private postsService: PostsService,
    private postsListPaginationService: PostsListPaginationService,
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
        this.fetchPosts();
      });
  }

  onPostEdit(id: string): void {
    this.router.navigate(['/edit-post', id]);
  }

  onPaginatorDataChange(paginationData: PaginationData): void {
    if (paginationData.pageSize !== this.postsListPaginationService.getPaginationData().pageSize) {
      paginationData = {
        ...paginationData,
        pageIndex: null,
        previousPageIndex: null,
      };
    }

    this.postsListPaginationService.updatePaginationData(paginationData);
    this.paginationData = paginationData;
    this.fetchPosts();
  }

  ngOnInit(): void {
    const paginationData: PaginationData = this.postsListPaginationService.getPaginationData();

    this.handleInitialSubscriptions();
    this.initializePagination(paginationData);

    if (this.postsService.getPostsToRenderIds().length) {
      this.posts = this.postsService.getPostsToRender();
      this.postsIds = this.postsService.getPostsToRenderIds();

      return;
    }

    if (paginationData.pageIndex !== null && paginationData.previousPageIndex !== null) {
      this.fetchPosts();
    } else {
      this.preloadPosts();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private initializePagination(paginationData: PaginationData): void {
    if (paginationData.pageIndex && paginationData.previousPageIndex) {
      this.paginationData = paginationData;

      return;
    }

    const paginationDataToUpdate = {
      length: this.route.snapshot.data.postsListLength as number,
      pageSize: 2
    };

    this.postsListPaginationService.updatePaginationData(paginationDataToUpdate);
    this.paginationData = {
      ...this.paginationData,
      ...paginationDataToUpdate
    };
  }

  private preloadPosts(): void {
    this.posts = this.postsService.getPostsToRender();
    this.postsIds = this.postsService.getPostsToRenderIds();

    this.postsService.postsListPending = true;

    this.postsService.fetchPostsInitially(this.paginationData.pageSize)
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((response: PostsResponse) => {
        this.handlePostsFetching(response);
      });
  }

  private fetchPosts(): void {
    const { pageIndex, previousPageIndex } = this.paginationData;

    this.postsService.fetchPosts(
      this.paginationData.previousPageIndex,
      this.paginationData.pageIndex,
      (pageIndex !== null && previousPageIndex !== null) ? this.postsIds[0] : null,
      this.paginationData.pageSize
    )
    .pipe(
      takeUntil(this.subscriptionController$$)
    )
    .subscribe((response: PostsResponse) => {
      this.handlePostsFetching(response);
    });
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

  private handlePostsFetching(postsFetchingResponse: PostsResponse): void {
    this.postsService.storePostsLocally(postsFetchingResponse.posts);
    this.posts = this.postsService.getPostsToRender();
    this.postsIds = this.postsService.getPostsToRenderIds();
    this.postsService.postsListPending = false;
  }
}
