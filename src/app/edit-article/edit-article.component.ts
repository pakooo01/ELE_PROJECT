import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '../interface/interface.module';  
import { NewsService } from '../services/news/news.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {
  articleForm: FormGroup;
  article: Article | undefined;

  constructor(
    private fb: FormBuilder,
    private articleService: NewsService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router  
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: [''],
      abstract: ['', Validators.required],
      body: ['', Validators.required],
      category: [''],
      thumbnail_image: [''], 
      thumbnail_media_type: [''], 
      image_data: [''],  
      image_media_type: ['']  
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticleById(id).subscribe((article) => {
      this.article = article;
      this.articleForm.patchValue(article);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.articleForm.patchValue({
          thumbnail_image: base64String,
          thumbnail_media_type: file.type,
          image_data: base64String,
          image_media_type: file.type
        });
      };
      reader.readAsDataURL(file); 
    }
  }

  onSubmit(): void {
    if (this.articleForm.valid && this.article) {
      const updatedArticle = {
        ...this.article,
        ...this.articleForm.value
      };
      this.articleService.updateArticle(updatedArticle).subscribe(() => {
        console.log('Article updated successfully');
        window.alert('Edit successful');
        this.goBack();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);  // Naviga verso la rotta '/main'
  }
}