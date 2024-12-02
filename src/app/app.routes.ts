import { Routes } from '@angular/router';
import { ArticleDetailComponent } from './article-details/article-details.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ArticleCreateComponent } from './article-form/article-form.component';
import { EditArticleComponent } from './edit-article/edit-article.component';

export const routes: Routes = [
    { path: 'articles', component: MainPageComponent },
    { path: 'article/:id', component: ArticleDetailComponent },  
    { path: 'article/new/form', component: ArticleCreateComponent  }, 
    { path: '', redirectTo: 'articles', pathMatch: 'full' },    
    { path: 'edit/:id', component: EditArticleComponent },
];
