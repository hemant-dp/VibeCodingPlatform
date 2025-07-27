import { Component } from '@angular/core';

@Component({
  selector: 'app-developers',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>For Developers</h1>
      <p>This is a dummy Developers page. Add your developer info here.</p>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 700px;
      margin: 48px auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 32px rgba(0,51,161,0.08);
      padding: 40px 32px;
      text-align: center;
    }
    h1 {
      color: #0033A1;
      font-size: 2.5rem;
      margin-bottom: 24px;
      letter-spacing: -1px;
    }
    p {
      color: #333;
      font-size: 1.1rem;
      margin-bottom: 18px;
    }
  `]
})
export class DevelopersComponent {}
