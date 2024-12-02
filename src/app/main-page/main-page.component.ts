import { Component, OnInit } from '@angular/core';
import { Article } from '../interface/interface.module';
import { NewsService } from '../services/news/news.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { LoginService } from '../services/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../interface/interface.module';



@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgIf, NgFor,NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  articles: Article[] = [];  
  errorMessage: string = '';
  filteredArticles: Article[] = [];
  categories: string[] = ['National', 'Economy', 'Sports', 'Technology', 'All'];
  selectedCategory: string = 'All'; 
  searchText: string = ''; 
  isNavbarOpen: boolean = false; 
  loginForm: FormGroup;
  message: string | null = null;
  user: User | null = null;
  isLoggedIn: boolean = false;
  loggedInUser: string = ''; 
  successMessage: string | null = null; 


  constructor(private newsService: NewsService, private router: Router, private fb: FormBuilder,private loginService: LoginService ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getArticles();
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.loginService.isLogged();
  }


  getArticles(): void {
    this.newsService.getArticles().subscribe({
      next: (data: Article[]) => {
        this.articles = data;
        this.filteredArticles = this.articles;  
        console.log('Articles received:', this.articles); 
      },
      error: (err) => {
        this.errorMessage = 'Failed to load articles';
        console.error('Error loading articles:', err);
      }
    });
  }

  filterArticles(category: string) {
    this.selectedCategory = category;

    if (category === 'All') {
      this.filteredArticles = this.articles; 
    } else {
      this.filteredArticles = this.articles.filter(article => article.category === category);
    }
  }

  applyFilters() {
    this.filteredArticles = this.articles.filter(article => {
        const matchesCategory = this.selectedCategory === 'All' || article.category === this.selectedCategory;

        const matchesSearch = (article.title?.toLowerCase().includes(this.searchText.toLowerCase()) || 
                               article.subtitle?.toLowerCase().includes(this.searchText.toLowerCase()) || 
                               article.abstract?.toLowerCase().includes(this.searchText.toLowerCase()));

        return matchesCategory && matchesSearch;
    });
}

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen; 
  }

  viewDetails(articleId: number) {
    this.router.navigate(['/article', articleId]); 
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.loginService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login error', response);
          this.newsService.setUserApiKey(response.apikey);
          this.isLoggedIn = true; 
          this.loggedInUser = response.username; 
          this.errorMessage = ''; 
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Verify username and password';
          this.isLoggedIn = false; 
        }
      });
    }
  }
  



  deleteArticle(articleId: number) {
    if (confirm('Are you sure you want to delete the article?')) {
      console.log(` ${articleId}`); 
      this.newsService.deleteArticle(articleId).subscribe({
        next: () => {
          
          this.filteredArticles = this.filteredArticles.filter(article => article.id !== articleId);
          this.successMessage = 'Article deleted successfully.';
        },
        error: (err) => {
          console.error('Error', err);
          this.errorMessage = 'Unable to delete the article.';
        }
      });
    }
  }

  goToTheForm(){
    this.router.navigate(['/article/new/form']);
  }

  editArticle(article: Article) {
    this.router.navigate(['/edit', article.id]);
  }

  logout() {
    this.isLoggedIn = false; 
    this.loginService.logout(); 
  }

}