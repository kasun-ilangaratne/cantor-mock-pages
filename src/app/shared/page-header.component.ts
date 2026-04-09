import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
    </header>
  `,
  styles: []
})
export class PageHeaderComponent {
  @Input() title: string = '';
} 