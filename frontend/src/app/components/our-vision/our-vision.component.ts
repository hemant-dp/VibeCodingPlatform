import { Component } from '@angular/core';

@Component({
  selector: 'app-our-vision',
  standalone: true,
  template: `
    <div class="vision-container">
      <h1>Our Vision</h1>
      <h2>Empowering Innovation and Learning</h2>
      <ul>
        <li>🚀 Foster a vibrant coding community for all skill levels.</li>
        <li>🌐 Bridge the gap between ideas and implementation.</li>
        <li>💡 Encourage creativity and problem-solving in technology.</li>
        <li>🤝 Support collaboration and knowledge sharing.</li>
        <li>🎯 Enable everyone to build, learn, and grow together.</li>
      </ul>
    </div>
  `,
  styles: [`
    .vision-container {
      max-width: 700px;
      margin: 48px auto;
      padding: 32px 24px;
      background: #f8faff;
      border-radius: 18px;
      box-shadow: 0 2px 16px #0033a10a;
      text-align: center;
    }
    .vision-container h1 {
      font-size: 2.4rem;
      margin-bottom: 0.5em;
      color: #16213E;
    }
    .vision-container h2 {
      font-size: 1.4rem;
      color: #0033A1;
      margin-bottom: 1.5em;
      font-weight: 500;
    }
    .vision-container ul {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: left;
      display: inline-block;
    }
    .vision-container li {
      font-size: 1.1rem;
      margin-bottom: 1em;
      color: #333;
      padding-left: 0.5em;
    }
  `]
})
export class OurVisionComponent {}
