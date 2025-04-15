import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { logincomponent } from "./authentication/login/login.component";
import { signupcomponent } from "./authentication/signup/signup.component";
import { AuthGuard } from "./authentication/auth.guard";

const routes: Routes = [
    { path: '', component: PostListComponent},
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
    { path:'login',component:logincomponent},
    { path: 'signup', component:signupcomponent}
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[AuthGuard] 
})

export class AppRoutingModule {

}