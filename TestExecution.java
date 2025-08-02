import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class TestExecution {
    
    public static void main(String[] args) {
        TestExecution test = new TestExecution();
        
        // Test Java execution
        System.out.println("=== Testing Java Execution ===");
        String javaCode = "public class Solution {\n" +
                         "    public static void main(String[] args) {\n" +
                         "        System.out.println(\"Hello from Java!\");\n" +
                         "    }\n" +
                         "}";
        System.out.println(test.executeJavaCode(javaCode));
        
        // Test C++ execution
        System.out.println("\n=== Testing C++ Execution ===");
        String cppCode = "#include <iostream>\n" +
                        "using namespace std;\n" +
                        "int main() {\n" +
                        "    cout << \"Hello from C++!\" << endl;\n" +
                        "    return 0;\n" +
                        "}";
        System.out.println(test.executeCppCode(cppCode));
        
        // Test Python execution
        System.out.println("\n=== Testing Python Execution ===");
        String pythonCode = "print(\"Hello from Python!\")";
        System.out.println(test.executePythonCode(pythonCode));
    }
    
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
}
