import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClientPost } from '../../shared/models/post.model';
import { PostsService } from '../posts.service';
import { PostsResponse } from '../../shared/models/posts.response.model';
import { RouterModule, Router } from '@angular/router';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public posts: ClientPost[] = [];

  constructor(public postsService: PostsService, private router: Router) {
    super();
  }

  onPostDelete(id: string): void {
    this.postsService.deletePostOnServer(id)
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({id: targetId}: PostsResponse) => {
        this.postsService.deletePostLocally(targetId);
      });
  }

  onPostEdit(id: string): void {
    this.router.navigate(['/edit-post', id]);
  }

  ngOnInit(): void {
    this.handleComponentSubscribtions();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private handleComponentSubscribtions(): void {
    this.postsService.fetchPosts()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((response: PostsResponse) => {
        this.postsService.storePostsLocally(response.posts as ClientPost[]);
      });

    this.postsService.getPostsUpdateListener()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((posts: ClientPost[]) => {
        this.posts = posts;
      });
  }
}
