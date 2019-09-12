import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientPost } from 'src/app/shared/models/post.model';
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

    this.postsService.addPost(this.postForm.value.title, this.postForm.value.content);
    this.postForm.reset();
  }

  ngOnInit(): void {
    this.initializePostForm();
    this.handleComponentSubscriptions();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private initializePostForm(): void {
    let initialPostFormTitle: string = null;
    let initialPostFormContent: string = null;

    this.targetPostId = this.route.snapshot.params.id;

    if (this.targetPostId) {
      const neededPost: ClientPost = this.postsService.getPosts().find(post => {
        return post.id === this.targetPostId;
      });

      initialPostFormTitle = neededPost.title;
      initialPostFormContent = neededPost.content;
      this.isEditMode = true;
    }

    this.postForm = new FormGroup({
      title: new FormControl(initialPostFormTitle, [Validators.minLength(3), Validators.required]),
      content: new FormControl(initialPostFormContent, [Validators.required])
    });
  }

  private handleComponentSubscriptions(): void {
    this.postsService.getExactPostUpdateListener()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({ id, title, content }: PostsResponse) => {
        this.postsService.updateExactPostLocally({ id, title, content });
        this.router.navigate(['/']);
      });
  }
}
