package com.vibe.platform.service;

import com.vibe.platform.model.Submission;
import com.vibe.platform.model.TestCase;
import com.vibe.platform.repository.SubmissionRepository;
import com.vibe.platform.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public void judge(Submission submission) {
        try {
            // Detach the entity and work with a fresh copy to avoid concurrency issues
            Long submissionId = submission.getId();
            Submission freshSubmission = submissionRepository.findById(submissionId)
                .orElse(submission); // Fallback to original if not found
            
            // Simulate compilation
            freshSubmission.setStatus(Submission.Status.COMPILING);
            
            submissionRepository.save(freshSubmission);
            Thread.sleep(random.nextInt(1000)); // Simulate compilation time

            // Check for compilation errors (simulated)
            if (freshSubmission.getCode().contains("error")) {
                freshSubmission.setStatus(Submission.Status.COMPILATION_ERROR);
                freshSubmission.setCompileOutput("Compilation error: Syntax error at line 1");
                submissionRepository.save(freshSubmission);
                return;
            }

            // Simulate execution
            freshSubmission.setStatus(Submission.Status.RUNNING);
            submissionRepository.save(freshSubmission);

            // Get test cases
            List<TestCase> testCases = testCaseRepository.findByProblemId(freshSubmission.getProblem().getId());
            boolean allPassed = true;

            for (TestCase testCase : testCases) {
                // Simulate test case execution
                Thread.sleep(random.nextInt(500)); // Simulate execution time

                // Simulate runtime error
                if (freshSubmission.getCode().contains("throw new")) {
                    freshSubmission.setStatus(Submission.Status.RUNTIME_ERROR);
                    freshSubmission.setJudgeOutput("Runtime error: NullPointerException");
                    submissionRepository.save(freshSubmission);
                    return;
                }

                // Simulate time limit exceeded
                if (freshSubmission.getCode().contains("while(true)")) {
                    freshSubmission.setStatus(Submission.Status.TIME_LIMIT_EXCEEDED);
                    freshSubmission.setExecutionTimeMs(executionTimeout + 1000);
                    submissionRepository.save(freshSubmission);
                    return;
                }

                // Simulate memory limit exceeded
                if (freshSubmission.getCode().contains("new byte[Integer.MAX_VALUE]")) {
                    freshSubmission.setStatus(Submission.Status.MEMORY_LIMIT_EXCEEDED);
                    freshSubmission.setMemoryUsedKb(memoryLimit + 1000);
                    submissionRepository.save(freshSubmission);
                    return;
                }

                // Simple string comparison (in a real system, this would be actual code execution)
                String expectedOutput = testCase.getExpectedOutput().trim();
                String actualOutput = simulateCodeExecution(freshSubmission.getCode(), testCase.getInput());

                if (!expectedOutput.equals(actualOutput)) {
                    allPassed = false;
                    break;
                }
            }

            // Set final status
            freshSubmission.setStatus(allPassed ? Submission.Status.ACCEPTED : Submission.Status.WRONG_ANSWER);
            freshSubmission.setExecutionTimeMs(random.nextInt(1000));
            freshSubmission.setMemoryUsedKb(random.nextInt(memoryLimit));
            submissionRepository.save(freshSubmission);

        } catch (Exception e) {
            // Use the submission ID to load fresh entity for error handling
            Long submissionId = submission.getId();
            Submission errorSubmission = submissionRepository.findById(submissionId)
                .orElse(submission);
            errorSubmission.setStatus(Submission.Status.RUNTIME_ERROR);
            errorSubmission.setJudgeOutput("Internal error: " + e.getMessage());
            submissionRepository.save(errorSubmission);
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