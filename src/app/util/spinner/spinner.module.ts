import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SkeletonModule } from 'primeng/skeleton';
import { SpinnerComponent } from './spinner.component';


@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    SkeletonModule
  ],
  exports: [
    SpinnerComponent
  ]
})
export class SpinnerModule { }
