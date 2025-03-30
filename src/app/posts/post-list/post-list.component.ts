import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    
    posts: Post[] = [];
    private postsSub!: Subscription;
    totalposts = 10;
    postperpage = 2;
    pageSizeOption = [1, 2, 5, 10];
    public Loading = false;

    constructor(public postsService: PostsService){}
    ngOnInit(){
        this.Loading = true;  
       this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdatedListener().subscribe((posts: Post[]) => {
            this.Loading = false;
            this.posts = posts;
        });
    }

    onChangedPage(pageData: PageEvent){  
        console.log(pageData);  
    }  
    
    onDelete(postId: string){
        this.postsService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}
