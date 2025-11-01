import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private http = inject(HttpClient);

  backendStatus: string = 'Checking...';
  backendResponse: any = null;

  ngOnInit() {
    this.http.get('http://localhost:3000/api/health').subscribe({
      next: (response) => {
        this.backendStatus = 'Connected';
        this.backendResponse = response;
      },
      error: (error) => {
        this.backendStatus = 'Failed';
        console.error('Backend connection failed:', error);
      }
    });
  }
}
