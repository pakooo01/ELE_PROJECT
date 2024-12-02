import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsService } from '../services/news/news.service'; 
import { Article } from '../interface/interface.module'; 
import { NgIf } from '@angular/common';
import * as _ from 'lodash';


@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [NgIf],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private newsService: NewsService) { }

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id'); 
    if (articleId) {
      this.newsService.getArticle(articleId).subscribe({
        next: (data: Article) => {
          this.article = data; 
          console.log(data)
        },
        error: (err) => {
          this.errorMessage = 'Article not found'; 
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/articles']); 
  }
}