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

@RestController
@RequestMapping("/api/execute")
@Tag(name = "Execution Controller", description = "APIs for code execution")
@CrossOrigin(origins = "http://localhost:4200")
public class ExecutionController {

    @Autowired
    private ExecutionService executionService;

    @PostMapping
    @Operation(summary = "Execute code", description = "Executes code against test cases without saving submission")
    public ResponseEntity<ExecutionResponse> execute(@Valid @RequestBody ExecutionRequest request) {
        return ResponseEntity.ok(executionService.execute(request));
    }
} 