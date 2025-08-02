export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  constraints?: string;
  methodTemplate: {
    [key: string]: string; // language as key, template code as value
  };
  testCases: {
    input: string;
    output: string;
    explanation?: string;
  }[];
}

export interface ProblemSubmission {
  problemId: number;
  language: string;
  code: string;
  output?: string;
  status?: 'Running' | 'Accepted' | 'Wrong Answer' | 'Error';
  executionTime?: number;
} 