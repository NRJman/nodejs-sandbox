import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { ClientPost } from "../../shared/post.model";
import { PostsService } from "../posts.service";
import { PostsResponse } from "../../shared/posts.response.model";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: ClientPost[] = [];
  private subscriptionsArray: Subscription[] = [];

  constructor(public postsService: PostsService) {}

  onPostDelete(id: string): void {
    this.subscriptionsArray.push(this.postsService.deletePostOnServer(id)
      .subscribe(({id: targetId}: {message: string, id: string}) => {
        this.postsService.deletePostLocally(targetId);
      }));
  }

  ngOnInit() {
    this.subscriptionsArray.push(this.postsService.fetchPosts()
      .subscribe((response: PostsResponse) => {
        this.postsService.storePostsLocally(response.posts as ClientPost[]);
      }));

      this.subscriptionsArray.push(this.postsService.getPostUpdateListener()
      .subscribe((posts: ClientPost[]) => {
        this.posts = posts;
      }));
  }

  ngOnDestroy() {
    this.subscriptionsArray.forEach(subscription => subscription.unsubscribe());
  }
}
