import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import {mimetype} from "./mime-type.validator";  



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
  public form!: FormGroup;
  public pickedImagePreview: string = '';
  
  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({  
      'title': new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {  
        validators:[Validators.required],  
        asyncValidators: [mimetype]  
        })
    });  
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.Loading = true;
        if(this.postId){
          this.postsService.getPost(this.postId).subscribe({
            next: (postData) => {
              this.post = {
                id: postData._id,
                title: postData.title,
                content: postData.content,
                imagePath: postData.imagePath
              };
          
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath // not null!
              });
          
              this.pickedImagePreview = this.post.imagePath;
              this.Loading = false;
            },
            error: (err) => {
              console.error('Failed to load post:', err);
              this.Loading = false; // ✅ ensure spinner stops even if error occurs
            }
          });          
        }
        
        
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  PickedImage(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input?.files || input.files.length === 0) {
      return;
    }
  
    const file = input.files[0]; // ✅ Define 'file'
  
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity(); // ✅ Optional chaining to avoid null error
  
    const reader = new FileReader();
    reader.onload = () => {
      this.pickedImagePreview = reader.result as string; // ✅ Use the correct property
    };
    reader.readAsDataURL(file);   
  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
  
    this.Loading = true;
  
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image // ✅ pass image (File)
      );
    } else {
      this.postsService.updatePost(
        this.postId as string,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
  
    this.Loading = false;
    this.form.reset();
  }
  
  
}
