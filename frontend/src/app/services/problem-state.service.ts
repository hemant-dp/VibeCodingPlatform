import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemStateService {
  private problemSolvedSubject = new BehaviorSubject<{problemId: number, solved: boolean} | null>(null);
  
  // Observable that components can subscribe to for problem state changes
  problemSolved$: Observable<{problemId: number, solved: boolean} | null> = this.problemSolvedSubject.asObservable();

  constructor() { }

  // Call this when a problem is successfully solved
  markProblemAsSolved(problemId: number) {
    this.problemSolvedSubject.next({problemId, solved: true});
  }

  // Call this to trigger a refresh of problem list
  triggerProblemListRefresh() {
    // This can be used to trigger a refresh without marking any specific problem
    this.problemSolvedSubject.next(null);
  }
}
