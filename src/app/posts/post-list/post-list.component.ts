import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../../shared/models/post.model';
import { PostsService } from '../posts.service';
import { PostsResponse } from '../../shared/models/posts.response.model';
import { Router } from '@angular/router';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public postsListPending: boolean = this.postsService.postsListPending;

  constructor(public postsService: PostsService, private router: Router) {
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

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();

    this.handleSubscriptions();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private handleSubscriptions(): void {
    this.postsService.getPostsUpdateListener()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });

    this.postsService.postsListPendingUpdated$
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((isPostsListPending: boolean) => {
        this.postsListPending = isPostsListPending;
      });
  }
}
