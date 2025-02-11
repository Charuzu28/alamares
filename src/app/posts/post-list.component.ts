import { Component, Input} from '@angular/core';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    @Input() posts = [
        {title: '1st tile', content: '1st content'}
    ];
}
