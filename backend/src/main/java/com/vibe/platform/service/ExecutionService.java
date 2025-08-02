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

import java.nio.file.Files;
import java.nio.file.Path;
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

    private String executeJavaCode(String code) {
        try {
            // Create a temporary directory
            Path tempDir = Files.createTempDirectory("javaexecution");
            
            // Create Solution.java file
            Path sourcePath = tempDir.resolve("Solution.java");
            Files.write(sourcePath, code.getBytes());
            
            // Compile the code
            ProcessBuilder compileBuilder = new ProcessBuilder("javac", sourcePath.toString());
            Process compileProcess = compileBuilder.start();
            int compileResult = compileProcess.waitFor();
            
            if (compileResult != 0) {
                String error = new String(compileProcess.getErrorStream().readAllBytes());
                return "Compilation Error:\n" + error;
            }
            
            // Run the code
            ProcessBuilder runBuilder = new ProcessBuilder("java", "-cp", tempDir.toString(), "Solution");
            Process runProcess = runBuilder.start();
            
            // Get output and error streams
            String output = new String(runProcess.getInputStream().readAllBytes());
            String error = new String(runProcess.getErrorStream().readAllBytes());
            
            int runResult = runProcess.waitFor();
            if (runResult != 0) {
                return "Runtime Error:\n" + error;
            }
            
            return output;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    private String executeCppCode(String code) {
        try {
            // Create a temporary directory
            Path tempDir = Files.createTempDirectory("cppexecution");
            
            // Create solution.cpp file
            Path sourcePath = tempDir.resolve("solution.cpp");
            Files.write(sourcePath, code.getBytes());
            
            // Create executable path
            Path executablePath = tempDir.resolve("solution.exe");
            
            // Compile the code using g++
            ProcessBuilder compileBuilder = new ProcessBuilder(
                "g++", "-std=c++17", "-o", executablePath.toString(), sourcePath.toString()
            );
            Process compileProcess = compileBuilder.start();
            int compileResult = compileProcess.waitFor();
            
            if (compileResult != 0) {
                String error = new String(compileProcess.getErrorStream().readAllBytes());
                return "Compilation Error:\n" + error;
            }
            
            // Run the executable
            ProcessBuilder runBuilder = new ProcessBuilder(executablePath.toString());
            Process runProcess = runBuilder.start();
            
            // Get output and error streams
            String output = new String(runProcess.getInputStream().readAllBytes());
            String error = new String(runProcess.getErrorStream().readAllBytes());
            
            int runResult = runProcess.waitFor();
            if (runResult != 0) {
                return "Runtime Error:\n" + error;
            }
            
            // Clean up temporary files
            Files.deleteIfExists(sourcePath);
            Files.deleteIfExists(executablePath);
            Files.deleteIfExists(tempDir);
            
            return output;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    private String executePythonCode(String code) {
        try {
            // Create a temporary directory
            Path tempDir = Files.createTempDirectory("pythonexecution");
            
            // Create solution.py file
            Path sourcePath = tempDir.resolve("solution.py");
            Files.write(sourcePath, code.getBytes());
            
            // Run the Python code
            ProcessBuilder runBuilder = new ProcessBuilder("python3", sourcePath.toString());
            Process runProcess = runBuilder.start();
            
            // Get output and error streams
            String output = new String(runProcess.getInputStream().readAllBytes());
            String error = new String(runProcess.getErrorStream().readAllBytes());
            
            int runResult = runProcess.waitFor();
            if (runResult != 0) {
                return "Runtime Error:\n" + error;
            }
            
            // Clean up temporary files
            Files.deleteIfExists(sourcePath);
            Files.deleteIfExists(tempDir);
            
            return output;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    public ExecutionResponse execute(ExecutionRequest request) {
        try {
            String output;
            String language = request.getLanguage();
            
            switch (language.toLowerCase()) {
                case "java":
                    output = executeJavaCode(request.getCode());
                    break;
                case "c++":
                case "cpp":
                    output = executeCppCode(request.getCode());
                    break;
                case "python":
                case "python3":
                    output = executePythonCode(request.getCode());
                    break;
                default:
                    return ExecutionResponse.builder()
                        .status("ERROR")
                        .error("Language not supported: " + language + ". Supported languages: Java, C++, Python")
                        .build();
            }
            
            return ExecutionResponse.builder()
                .status("SUCCESS")
                .output(output)
                .build();
                
        } catch (Exception e) {
            return ExecutionResponse.builder()
                .status("ERROR")
                .error("Failed to execute code: " + e.getMessage())
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