import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostsList } from 'src/app/shared/models/post.model';
import { PostsResponse } from 'src/app/shared/models/posts.response.model';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  providers: [ValidatorsService]
})
export class PostCreateComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public postsListPending: boolean = this.postsService.postsListPending;
  public imageSrc: string;
  public imageTitle: string;
  private postForm: FormGroup;
  private isEditMode = false;
  private targetPostId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private validatorsService: ValidatorsService
  ) {
    super();
  }

  handlePostFormSubmission(): void {
    if (this.postForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      const fieldsToUpdate: { title?: string, content?: string, image?: File } = this.getDirtiedControls(this.postForm.controls);

      if (!fieldsToUpdate) {
        this.router.navigate(['/']);

        return;
      }

      this.postsService.updateExactPostOnServer(this.targetPostId, fieldsToUpdate);

      return;
    }

    const postFormValue = this.postForm.value;

    this.postsService.storePostOnServer(postFormValue.title, postFormValue.content, postFormValue.image)
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({ post, id }: PostsResponse) => {
        // this.postsService.addPost(id, post);
        this.router.navigate(['/']);
      });
  }

  onFileValueChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      this.imageSrc = fileReader.result as string;
    });

    if (file) {
      this.postForm.patchValue({ image: file });
      this.postForm.get('image').updateValueAndValidity();
      this.postForm.get('image').markAsDirty();
      this.imageTitle = file.name;
      fileReader.readAsDataURL(file);
    }
  }

  onImageControlTouch(): void {
    this.postForm.get('image').markAsTouched();
  }

  ngOnInit(): void {
    this.targetPostId = this.route.snapshot.params.id;

    if (this.targetPostId) {
      this.isEditMode = true;
    }

    this.handlePostFormInitializing();
    this.handleInitialSubscriptions();
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

    if (this.postsService.getPostsToRenderIds().length) {
      this.initializePostForm(getNeededPost(this.postsService.getPostsToRender(), this.targetPostId));
      this.imageSrc = this.postForm.value.image;

      return;
    }

    const postsServiceCopy = this.postsService;

    this.postsService.postsListPendingUpdated$
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((isPostsListPending: boolean) => {
        this.postsListPending = isPostsListPending;

        if (!isPostsListPending) {
          this.initializePostForm(getNeededPost(postsServiceCopy.getPostsToRender(), this.targetPostId));
          this.imageSrc = this.postForm.value.image;
        }
      });

    function getNeededPost(posts: PostsList, id: string): Post {
      return posts[id];
    }
  }

  private initializePostForm(neededPost: Post): void {
    this.postForm = new FormGroup({
      title: new FormControl(neededPost ? neededPost.title : null, [Validators.minLength(3), Validators.required]),
      content: new FormControl(neededPost ? neededPost.content : null, [Validators.required]),
      image: new FormControl(neededPost ? neededPost.imageSrc : null, [Validators.required], [
        this.validatorsService.fileTypedAsImage.bind(this.validatorsService)
      ])
    });
  }

  private handleInitialSubscriptions(): void {
    this.postsService.getExactPostUpdateListener()
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({ id, postUpdated }: PostsResponse) => {
        this.postsService.updateExactPostLocally(id, postUpdated);
        this.router.navigate(['/']);
      });
  }

  private getDirtiedControls(
    controls: { [key: string]: AbstractControl }
  ): { title?: string, content?: string, image?: File } {
    const dirtiedControls: object = {};

    for (const controlName in controls) {
      if (controls[controlName].dirty) {
        dirtiedControls[controlName] = controls[controlName].value;
      }
    }

    return (Object.entries(dirtiedControls).length > 0) ? dirtiedControls : null;
  }
}
