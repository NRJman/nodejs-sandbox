import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscriberService } from './shared/services/unsubscriber.service';
import { PostsService } from './posts/posts.service';
import { takeUntil, delay } from 'rxjs/operators';
import { PostsResponse } from './shared/models/posts.response.model';
import { Post, PostsList } from './shared/models/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends UnsubscriberService implements OnInit, OnDestroy {
  constructor(private postsService: PostsService) {
    super();
  }

  ngOnInit(): void {
    this.handleSubscriptions();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private handleSubscriptions(): void {
    this.postsService.postsListPending = true;

    this.postsService.fetchPosts()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((response: PostsResponse) => {
        this.postsService.storePostsLocally(response.posts);
        this.postsService.postsListPending = false;
      });
  }
}
