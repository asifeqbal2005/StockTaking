import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MultilingualPipe } from './multilingual.pipe';


@NgModule({
  declarations: [MultilingualPipe], // <---
  imports:[CommonModule],
  exports: [MultilingualPipe] // <---
})

export class PipeModule{}
