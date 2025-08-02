package com.vibe.platform.controller;

import com.vibe.platform.dto.execution.ExecutionRequest;
import com.vibe.platform.dto.execution.ExecutionResponse;
import com.vibe.platform.service.ExecutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/execute")
@CrossOrigin(origins = "*", allowCredentials = "false", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class ExecutionController {

    @Autowired
    private ExecutionService executionService;

    @PostMapping
    public ResponseEntity<ExecutionResponse> execute(@RequestBody ExecutionRequest request) {
        try {
            System.out.println("Received execution request: " + request);
            ExecutionResponse response = executionService.execute(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Execution error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ExecutionResponse.builder()
                    .status("ERROR")
                    .error("Failed to execute code: " + e.getMessage())
                    .build());
        }
    }
} 