import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  template: `
    <div class="about-container">
      <h1>About Cognizant VibeCoding Platform</h1>
      <p>
        <strong>Our Mission:</strong> Empowering developers and teams to innovate with confidence and agility through modern, collaborative coding solutions.
      </p>
      <p>
        <strong>Our Vision:</strong> To be the leading platform for coding, learning, and digital transformation in the enterprise world.
      </p>
      <p>
        <strong>Who We Are:</strong> Cognizant is a global leader in business and technology services, helping clients modernize technology, reimagine processes, and transform experiences.
      </p>
      <ul>
        <li>🌐 Global Reach, Local Impact</li>
        <li>💡 Innovation at Scale</li>
        <li>🤝 Commitment to Clients</li>
        <li>👩‍💻 Empowering Developers</li>
      </ul>
    </div>
  `,
  styles: [`
    .about-container {
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
    ul {
      list-style: none;
      padding: 0;
      margin-top: 32px;
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
    }
    li {
      background: #f1f6fb;
      color: #0033A1;
      border-radius: 8px;
      padding: 14px 24px;
      font-size: 1.1rem;
      box-shadow: 0 2px 8px rgba(0,51,161,0.04);
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `]
})
export class AboutUsComponent {}
