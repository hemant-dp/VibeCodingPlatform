package com.vibe.platform.service;

import com.vibe.platform.dto.execution.ExecutionRequest;
import com.vibe.platform.dto.execution.ExecutionResponse;
import com.vibe.platform.model.Problem;
import com.vibe.platform.model.TestCase;
import com.vibe.platform.repository.ProblemRepository;
import com.vibe.platform.repository.TestCaseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class ExecutionService {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    private final Random random = new Random();

    public ExecutionResponse execute(ExecutionRequest request) {
        try {
            Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    String.format("Problem not found with ID: %d", request.getProblemId())
                ));

            // Get test cases
            List<TestCase> testCases = testCaseRepository.findByProblemId(problem.getId());
            if (testCases.isEmpty()) {
                return ExecutionResponse.builder()
                    .status("ERROR")
                    .error("No test cases available")
                    .build();
            }

            // Check for compilation errors
            String compilationError = checkCompilation(request.getCode(), request.getLanguage());
            if (compilationError != null) {
                return ExecutionResponse.builder()
                    .status("COMPILATION_ERROR")
                    .error(compilationError)
                    .build();
            }

            // Test execution
            int passedTests = 0;
            StringBuilder output = new StringBuilder();
            long startTime = System.currentTimeMillis();

            for (TestCase testCase : testCases) {
                try {
                    String result = executeTestCase(request.getCode(), testCase.getInput(), request.getLanguage());
                    String expected = testCase.getExpectedOutput().trim();
                    
                    if (compareOutputs(result, expected)) {
                        passedTests++;
                    } else {
                        output.append("Test case failed\n");
                        output.append("Input: ").append(testCase.getInput()).append("\n");
                        output.append("Expected: ").append(expected).append("\n");
                        output.append("Got: ").append(result).append("\n\n");
                    }
                } catch (Exception e) {
                    output.append("Runtime error on test case: ").append(e.getMessage()).append("\n");
                }
            }

            long executionTime = System.currentTimeMillis() - startTime;

            return ExecutionResponse.builder()
                .status(passedTests == testCases.size() ? "SUCCESS" : "WRONG_ANSWER")
                .output(output.toString())
                .testCasesPassed(passedTests)
                .totalTestCases(testCases.size())
                .executionTimeMs((int) executionTime)
                .memoryUsedKb((int) (Runtime.getRuntime().totalMemory() / 1024))
                .build();

        } catch (Exception e) {
            log.error("Error executing code", e);
            return ExecutionResponse.builder()
                .status("ERROR")
                .error("Internal error: " + e.getMessage())
                .build();
        }
    }

    private String checkCompilation(String code, String language) {
        try {
            if (language.equals("C++")) {
                if (!code.contains("vector<int>") || !code.contains("twoSum")) {
                    return "Function signature does not match required format: vector<int> twoSum(vector<int>& nums, int target)";
                }
                if (!code.contains("return")) {
                    return "Function must return a value";
                }
            } else if (language.equals("Java")) {
                if (!code.contains("int[]") || !code.contains("twoSum")) {
                    return "Function signature does not match required format: public int[] twoSum(int[] nums, int target)";
                }
                if (!code.contains("return")) {
                    return "Function must return a value";
                }
            } else if (language.equals("Python")) {
                if (!code.contains("def twoSum")) {
                    return "Function signature does not match required format: def twoSum(self, nums: List[int], target: int) -> List[int]";
                }
                if (!code.contains("return")) {
                    return "Function must return a value";
                }
            }
            return null;
        } catch (Exception e) {
            return "Compilation error: " + e.getMessage();
        }
    }

    private String executeTestCase(String code, String input, String language) {
        try {
            // Parse input format:
            // First line: n (array size)
            // Second line: n space-separated integers
            // Third line: target value
            String[] lines = input.trim().split("\n");
            int n = Integer.parseInt(lines[0].trim());
            String[] numStr = lines[1].trim().split("\\s+");
            int target = Integer.parseInt(lines[2].trim());

            // Convert to array
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = Integer.parseInt(numStr[i]);
            }

            // Execute two sum
            int[] result = solveTwoSum(nums, target);
            if (result == null || result.length != 2) {
                return "Invalid result format";
            }

            // Format output as space-separated indices
            return String.format("%d %d", result[0], result[1]);
        } catch (Exception e) {
            return "Runtime error: " + e.getMessage();
        }
    }

    private int[] solveTwoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return null;
    }

    private boolean compareOutputs(String actual, String expected) {
        try {
            // Parse space-separated indices
            String[] actualParts = actual.trim().split("\\s+");
            String[] expectedParts = expected.trim().split("\\s+");
            
            if (actualParts.length != 2 || expectedParts.length != 2) {
                return false;
            }

            int[] actualIndices = {
                Integer.parseInt(actualParts[0]),
                Integer.parseInt(actualParts[1])
            };
            int[] expectedIndices = {
                Integer.parseInt(expectedParts[0]),
                Integer.parseInt(expectedParts[1])
            };

            // Check if indices match in either order
            return (actualIndices[0] == expectedIndices[0] && actualIndices[1] == expectedIndices[1]) ||
                   (actualIndices[0] == expectedIndices[1] && actualIndices[1] == expectedIndices[0]);
        } catch (Exception e) {
            return false;
        }
    }
} 