import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string | null = null;
  public post: Post | null = null;
  public Loading = false;
  
  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.Loading = true;
        if(this.postId){
          this.postsService.getPost(this.postId).subscribe(postData=>{  
            this.Loading = false;
            this.post = {id: postData._id, title:postData.title, content:postData.content}  
          }); 
        }
        
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.Loading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
      this.Loading = false;
    } else {
      this.postsService.updatePost(
        this.postId as string, 
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
