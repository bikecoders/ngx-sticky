import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StickyDirective } from './sticky.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [StickyDirective],
  exports: [StickyDirective]
})
export class StickyDirectiveModule { }

