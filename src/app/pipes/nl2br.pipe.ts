import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2brPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null): SafeHtml {
    if (!value) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(value.replace(/\n/g, '<br>'));
  }
} 