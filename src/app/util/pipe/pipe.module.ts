import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlerteFormatterPipe } from './alerte/alerte-formatter.pipe';
import { TextFormatterPipe } from './text/text-formatter.pipe';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { ThousandsSeparatorPipe } from './text/number-formatter.pipe';



@NgModule({
  declarations: [
    AlerteFormatterPipe,
    TextFormatterPipe,
    SafeUrlPipe,
    ThousandsSeparatorPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlerteFormatterPipe,
    TextFormatterPipe,
    SafeUrlPipe,
    ThousandsSeparatorPipe
  ]
})
export class PipeModule { }
