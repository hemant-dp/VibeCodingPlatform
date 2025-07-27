import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { ProblemService } from '../../services/problem.service';
import { UserService } from '../../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [
    ProblemService,
    UserService
  ]
})
export class ProblemModule { } 