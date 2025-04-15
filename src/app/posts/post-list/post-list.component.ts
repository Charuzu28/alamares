import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from "../post.model";
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    
    posts: Post[] = [];
    private postsSub!: Subscription;
    totalposts= 0;  
    postperpage = 2;
    currentpage= 1;  
    pageSizeOption = [1, 2, 5, 10];
    userIsAuthenticated = false;
    public Loading = false;
    private authStatusSub!: Subscription;
    userId: string = ''; 

    constructor(public postsService: PostsService, private authService: AuthService){}  
    ngOnInit(){
        this.Loading = true;  
        this.postsService.getPosts(this.postperpage, this.currentpage);
        this.userId = this.authService.getUserId();     
        this.postsSub = this.postsService.getPostUpdatedListener()
        .subscribe((postData:{posts: Post[], postCount:number})=>{  
            this.Loading = false;
            this.totalposts = postData.postCount;  
            this.posts = postData.posts;  
        });
        this.userIsAuthenticated = this.authService.getIsAuth();  
        this.authStatusSub = this.authService.getAuthStatusListener()  
      .subscribe(isAuthenticated=>{  
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();  
      });  
    }

    onChangedPage(pageData: PageEvent){
        this.Loading = true;  
        this.currentpage = pageData.pageIndex+1;
        this.postperpage = pageData.pageSize;  
        this.postsService.getPosts(this.postperpage, this.currentpage);  
      }   
    
      onDelete(postId: string){  
        this.Loading = true;  
        this.postsService.deletePost(postId)  
          .subscribe(()=>{  
            this.postsService.getPosts(this.postperpage, this.currentpage);  
          });  
      }  

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();  
    }
}
