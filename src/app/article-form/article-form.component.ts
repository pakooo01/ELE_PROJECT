import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../services/news/news.service'; 
import { Article } from '../interface/interface.module';   
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleCreateComponent {
  articleForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private router: Router
  ) {
    this.articleForm = this.formBuilder.group({
      title: ['', Validators.required],
      subtitle: [''],
      abstract: ['', Validators.required],
      category: ['', Validators.required],
      body: ['', Validators.required],
      thumbnail_image: [''],
      thumbnail_media_type: [''],
      image_data: [''],           
      image_media_type: ['']      
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
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
  

  onSubmit() {
    if (this.articleForm.valid) {
      const article: Article = this.articleForm.value;

      this.newsService.createArticle(article).subscribe(
        (response: Article) => {
          console.log('Article created:', response);
          window.alert('Article created successfully!')
          this.router.navigate(['/articles']); 
        },
        (error) => {
          console.error('Error creating article:', error);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/articles']);
  }
}
