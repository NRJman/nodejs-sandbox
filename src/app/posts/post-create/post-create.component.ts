import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/shared/models/post.model';
import { Subscription } from 'rxjs';
import { PostsResponse } from 'src/app/shared/models/posts.response.model';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public postsListPending: boolean = this.postsService.postsListPending;
  private postForm: FormGroup;
  private isEditMode = false;
  private targetPostId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  handlePostFormSubmission(): void {
    if (this.postForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.postsService.updateExactPostOnServer(this.targetPostId, this.postForm.value.title, this.postForm.value.content);

      return;
    }

    this.postsService.storePostOnServer(this.postForm.value.title, this.postForm.value.content)
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((response: { message: string, post: Post }) => {
        this.postsService.addPost(response.post);
        this.router.navigate(['/']);
      });
  }

  ngOnInit(): void {
    this.targetPostId = this.route.snapshot.params.id;

    if (this.targetPostId) {
      this.isEditMode = true;
    }

    this.handlePostFormInitializing();
    this.handleSubscriptions();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private handlePostFormInitializing(): void {
    if (!this.isEditMode) {
      this.initializePostForm(null);
      this.postsListPending = false;

      return;
    }

    if (this.postsService.getPosts().length) {
      this.initializePostForm(getNeededPost(this.postsService.getPosts(), this.targetPostId));
    }

    this.postsService.postsListPendingUpdated$
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((isPostsListPending: boolean) => {
        this.postsListPending = isPostsListPending;

        if (!isPostsListPending) {
          this.initializePostForm(getNeededPost(this.postsService.getPosts(), this.targetPostId));
        }
      });

    function getNeededPost(posts: Post[], targetPostId: string): Post {
      return posts.find(post => {
        return post.id === targetPostId;
      });
    }
  }

  private initializePostForm(neededPost: Post): void {
    this.postForm = new FormGroup({
      title: new FormControl(neededPost ? neededPost.title : null, [Validators.minLength(3), Validators.required]),
      content: new FormControl(neededPost ? neededPost.content : null, [Validators.required])
    });
  }

  private handleSubscriptions(): void {
    this.postsService.getExactPostUpdateListener()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({ post }: PostsResponse) => {
        this.postsService.updateExactPostLocally({
          id: post.id,
          title: post.title,
          content: post.content
        });
        this.router.navigate(['/']);
      });
  }
}
