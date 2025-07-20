package com.vibe.platform.service;

import com.vibe.platform.dto.problem.ProblemRequest;
import com.vibe.platform.dto.problem.ProblemResponse;
import com.vibe.platform.model.Problem;
import com.vibe.platform.model.TestCase;
import com.vibe.platform.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    public ProblemResponse createProblem(ProblemRequest request) {
        Problem problem = new Problem();
        updateProblemFromRequest(problem, request);
        return convertToResponse(problemRepository.save(problem));
    }

    public ProblemResponse getProblem(Long id) {
        return problemRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
    }

    public ProblemResponse updateProblem(Long id, ProblemRequest request) {
        return problemRepository.findById(id)
                .map(problem -> {
                    updateProblemFromRequest(problem, request);
                    return convertToResponse(problemRepository.save(problem));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
    }

    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found");
        }
        problemRepository.deleteById(id);
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