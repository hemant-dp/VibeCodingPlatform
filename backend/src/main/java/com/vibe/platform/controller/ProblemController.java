package com.vibe.platform.controller;

import com.vibe.platform.dto.problem.ProblemRequest;
import com.vibe.platform.dto.problem.ProblemResponse;
import com.vibe.platform.model.Problem;
import com.vibe.platform.model.TestCase;
import com.vibe.platform.repository.ProblemRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/problems")
@CrossOrigin(origins = "http://localhost:4200")
public class ProblemController {

    @Autowired
    private ProblemRepository problemRepository;

    @GetMapping
    public List<ProblemResponse> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/recent")
    public List<ProblemResponse> getRecentProblems(@RequestParam(defaultValue = "5") int limit) {
        return problemRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemResponse> getProblem(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(problem -> ResponseEntity.ok(convertToResponse(problem)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProblemResponse createProblem(@Valid @RequestBody ProblemRequest request) {
        Problem problem = new Problem();
        updateProblemFromRequest(problem, request);
        return convertToResponse(problemRepository.save(problem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProblemResponse> updateProblem(@PathVariable Long id, @Valid @RequestBody ProblemRequest request) {
        return problemRepository.findById(id)
                .map(problem -> {
                    updateProblemFromRequest(problem, request);
                    return ResponseEntity.ok(convertToResponse(problemRepository.save(problem)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        if (!problemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        problemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private void updateProblemFromRequest(Problem problem, ProblemRequest request) {
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setConstraints(request.getConstraints());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setTags(request.getTags());
    }

    private ProblemResponse convertToResponse(Problem problem) {
        List<ProblemResponse.TestCaseResponse> testCaseResponses = problem.getTestCases().stream()
                .map(this::convertToTestCaseResponse)
                .collect(Collectors.toList());

        return ProblemResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .constraints(problem.getConstraints())
                .inputFormat(problem.getInputFormat())
                .outputFormat(problem.getOutputFormat())
                .tags(problem.getTags())
                .createdAt(problem.getCreatedAt())
                .testCases(testCaseResponses)
                .build();
    }

    private ProblemResponse.TestCaseResponse convertToTestCaseResponse(TestCase testCase) {
        return ProblemResponse.TestCaseResponse.builder()
                .id(testCase.getId())
                .input(testCase.getInput())
                .expectedOutput(testCase.getExpectedOutput())
                .isSample(testCase.isSample())
                .build();
    }
} 