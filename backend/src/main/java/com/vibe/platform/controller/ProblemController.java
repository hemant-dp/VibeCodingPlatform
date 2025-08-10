package com.vibe.platform.controller;

import com.vibe.platform.dto.problem.ProblemListResponse;
import com.vibe.platform.dto.problem.ProblemRequest;
import com.vibe.platform.dto.problem.ProblemResponse;
import com.vibe.platform.model.Problem;
import com.vibe.platform.model.Submission;
import com.vibe.platform.repository.ProblemRepository;
import com.vibe.platform.repository.SubmissionRepository;
import com.vibe.platform.service.ProblemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/problems")
@Tag(name = "Problem Controller", description = "APIs for managing coding problems")
public class ProblemController {

    private static final Logger logger = LoggerFactory.getLogger(ProblemController.class);

    @Autowired
    private ProblemService problemService;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping
    @Operation(summary = "Get all problems", description = "Retrieves a list of all coding problems with basic information")
    public ResponseEntity<List<ProblemListResponse>> getAllProblems(Authentication authentication) {
        List<Problem> problems = problemRepository.findAll();
        String username = authentication != null ? authentication.getName() : null;
        logger.info("Getting all problems for user: {}", username != null ? username : "anonymous");

        List<ProblemListResponse> response = problems.stream()
            .map(problem -> {
                // Calculate acceptance rate
                long totalSubmissions = submissionRepository.countByProblemId(problem.getId());
                long acceptedSubmissions = submissionRepository.countByProblemIdAndStatus(problem.getId(), Submission.Status.ACCEPTED);
                int acceptanceRate = totalSubmissions > 0 
                    ? (int) ((acceptedSubmissions * 100.0) / totalSubmissions) 
                    : 0;

                // Check if user has solved the problem
                boolean solved = false;
                if (username != null) {
                    solved = submissionRepository.existsByProblemIdAndUserUsernameAndStatus(
                        problem.getId(), username, Submission.Status.ACCEPTED);
                }

                return ProblemListResponse.builder()
                    .id(problem.getId())
                    .title(problem.getTitle())
                    .difficulty(problem.getDifficulty())
                    .tags(problem.getTags())
                    .acceptanceRate(acceptanceRate)
                    .solved(solved)
                    .build();
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent problems", description = "Retrieves the most recently added problems")
    public ResponseEntity<List<ProblemListResponse>> getRecentProblems(
            @RequestParam(defaultValue = "5") int limit) {
        List<Problem> problems = problemRepository.findAll(
            PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();

        List<ProblemListResponse> response = problems.stream()
            .map(problem -> ProblemListResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .tags(problem.getTags())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a new problem", description = "Creates a new coding problem")
    public ResponseEntity<ProblemResponse> createProblem(@Valid @RequestBody ProblemRequest request) {
        return ResponseEntity.ok(problemService.createProblem(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get problem by ID", description = "Retrieves a specific coding problem by its ID")
    public ResponseEntity<ProblemResponse> getProblem(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblem(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a problem", description = "Updates an existing coding problem")
    public ResponseEntity<ProblemResponse> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {
        return ResponseEntity.ok(problemService.updateProblem(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a problem", description = "Deletes an existing coding problem")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/recent")
    @Operation(summary = "Get recent problems for a user", description = "Retrieves the most recent problems attempted or solved by a specific user")
    public ResponseEntity<List<ProblemListResponse>> getRecentProblemsForUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        // Get recent submissions for user
        List<Submission> submissions = submissionRepository.findByUserId(userId);
        // Sort by submittedAt descending, get unique problem IDs
        List<Long> recentProblemIds = submissions.stream()
            .sorted((s1, s2) -> s2.getSubmittedAt().compareTo(s1.getSubmittedAt()))
            .map(s -> s.getProblem().getId())
            .distinct()
            .limit(limit)
            .collect(Collectors.toList());
        List<Problem> problems = problemRepository.findAllById(recentProblemIds);
        // Preserve order of recentProblemIds
        List<ProblemListResponse> response = recentProblemIds.stream()
            .map(pid -> problems.stream().filter(p -> p.getId().equals(pid)).findFirst().orElse(null))
            .filter(p -> p != null)
            .map(problem -> ProblemListResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .tags(problem.getTags())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}