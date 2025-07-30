import { Component } from '@angular/core';

@Component({
  selector: 'app-resources',
  standalone: true,
  template: `

    <div class="page-container">
      <h1>Resources</h1>
      <p>This is a dummy Resources page. Add your resources info here.</p>
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
export class ResourcesComponent {}
