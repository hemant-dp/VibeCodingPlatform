package com.vibe.platform.service;

import com.vibe.platform.model.Submission;
import com.vibe.platform.model.TestCase;
import com.vibe.platform.repository.SubmissionRepository;
import com.vibe.platform.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class JudgeService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Value("${judge.timeout.compilation}")
    private int compilationTimeout;

    @Value("${judge.timeout.execution}")
    private int executionTimeout;

    @Value("${judge.memory.limit}")
    private int memoryLimit;

    private final Random random = new Random();

    @Async
    public void judge(Submission submission) {
        try {
            // Simulate compilation
            submission.setStatus(Submission.Status.COMPILING);
            
            submissionRepository.save(submission);
            Thread.sleep(random.nextInt(1000)); // Simulate compilation time

            // Check for compilation errors (simulated)
            if (submission.getCode().contains("error")) {
                submission.setStatus(Submission.Status.COMPILATION_ERROR);
                submission.setCompileOutput("Compilation error: Syntax error at line 1");
                submissionRepository.save(submission);
                return;
            }

            // Simulate execution
            submission.setStatus(Submission.Status.RUNNING);
            submissionRepository.save(submission);

            // Get test cases
            List<TestCase> testCases = testCaseRepository.findByProblemId(submission.getProblem().getId());
            boolean allPassed = true;

            for (TestCase testCase : testCases) {
                // Simulate test case execution
                Thread.sleep(random.nextInt(500)); // Simulate execution time

                // Simulate runtime error
                if (submission.getCode().contains("throw new")) {
                    submission.setStatus(Submission.Status.RUNTIME_ERROR);
                    submission.setJudgeOutput("Runtime error: NullPointerException");
                    submissionRepository.save(submission);
                    return;
                }

                // Simulate time limit exceeded
                if (submission.getCode().contains("while(true)")) {
                    submission.setStatus(Submission.Status.TIME_LIMIT_EXCEEDED);
                    submission.setExecutionTimeMs(executionTimeout + 1000);
                    submissionRepository.save(submission);
                    return;
                }

                // Simulate memory limit exceeded
                if (submission.getCode().contains("new byte[Integer.MAX_VALUE]")) {
                    submission.setStatus(Submission.Status.MEMORY_LIMIT_EXCEEDED);
                    submission.setMemoryUsedKb(memoryLimit + 1000);
                    submissionRepository.save(submission);
                    return;
                }

                // Simple string comparison (in a real system, this would be actual code execution)
                String expectedOutput = testCase.getExpectedOutput().trim();
                String actualOutput = simulateCodeExecution(submission.getCode(), testCase.getInput());

                if (!expectedOutput.equals(actualOutput)) {
                    allPassed = false;
                    break;
                }
            }

            // Set final status
            submission.setStatus(allPassed ? Submission.Status.ACCEPTED : Submission.Status.WRONG_ANSWER);
            submission.setExecutionTimeMs(random.nextInt(1000));
            submission.setMemoryUsedKb(random.nextInt(memoryLimit));
            submissionRepository.save(submission);

        } catch (Exception e) {
            submission.setStatus(Submission.Status.RUNTIME_ERROR);
            submission.setJudgeOutput("Internal error: " + e.getMessage());
            submissionRepository.save(submission);
        }
    }

    private String simulateCodeExecution(String code, String input) {
        // This is a mock implementation
        // In a real system, this would execute the code in a sandboxed environment
        if (code.contains("System.out.println(1+1)")) {
            return "2";
        }
        return "Wrong answer";
    }
} 