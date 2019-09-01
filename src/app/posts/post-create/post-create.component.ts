import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientPost } from 'src/app/shared/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private postForm: FormGroup;
  private isEditMode = false;
  private targetPostId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  handlePostFormSubmission() {
    if (this.postForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.postsService.updatePost(this.targetPostId, this.postForm.value.title, this.postForm.value.content);
      this.router.navigate(['/']);
    }

    this.postsService.addPost(this.postForm.value.title, this.postForm.value.content);
    this.postForm.reset();
  }

  ngOnInit(): void {
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
}
