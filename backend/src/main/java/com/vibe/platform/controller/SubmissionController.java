package com.vibe.platform.controller;

import com.vibe.platform.dto.submission.SubmissionRequest;
import com.vibe.platform.dto.submission.SubmissionResponse;
import com.vibe.platform.model.User;
import com.vibe.platform.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@Tag(name = "Submission Controller", description = "APIs for managing code submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping
    @Operation(summary = "Get all submissions", description = "Retrieves all submissions, optionally filtered by problem ID")
    public ResponseEntity<List<SubmissionResponse>> getSubmissions(
            @RequestParam(required = false) Long problemId) {
        return ResponseEntity.ok(submissionService.getAllSubmissions(problemId));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent submissions", description = "Retrieves the most recent submissions")
    public ResponseEntity<List<SubmissionResponse>> getRecentSubmissions(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(submissionService.getRecentSubmissions(limit));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get submission by ID", description = "Retrieves a specific submission by its ID")
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }

    @GetMapping("/my-submissions")
    @Operation(summary = "Get user submissions", description = "Retrieves all submissions for the authenticated user")
    public ResponseEntity<List<SubmissionResponse>> getUserSubmissions(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(submissionService.getUserSubmissions(user));
    }

    @PostMapping
    @Operation(summary = "Submit code", description = "Submits code for a problem and initiates judging")
    public ResponseEntity<SubmissionResponse> submit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SubmissionRequest request) {
        
        // Temporary fix for disabled authentication - create a default user
        if (user == null) {
            user = User.builder()
                .id(1L)
                .username("anonymous")
                .email("anonymous@example.com")
                .build();
        }
        
        return ResponseEntity.ok(submissionService.submit(user, request));
    }
} 