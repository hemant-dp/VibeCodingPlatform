package com.vibe.platform.service;

import com.vibe.platform.dto.submission.SubmissionRequest;
import com.vibe.platform.dto.submission.SubmissionResponse;
import com.vibe.platform.model.Problem;
import com.vibe.platform.model.Submission;
import com.vibe.platform.model.User;
import com.vibe.platform.repository.ProblemRepository;
import com.vibe.platform.repository.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SubmissionService {

    private static final int MAX_CODE_LENGTH = 65535; // MySQL TEXT limit
    private static final int MAX_RECENT_SUBMISSIONS = 100;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private JudgeService judgeService;

    /**
     * Get all submissions with optional problem ID filter
     * @param problemId Optional problem ID to filter submissions
     * @return List of submission responses
     */
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getAllSubmissions(Long problemId) {
        try {
            List<Submission> submissions;
            if (problemId != null) {
                validateProblemExists(problemId);
                submissions = submissionRepository.findByProblemId(problemId);
            } else {
                submissions = submissionRepository.findAll();
            }
            return submissions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching submissions for problemId: {}", problemId, e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to retrieve submissions"
            );
        }
    }

    /**
     * Get recent submissions with pagination
     * @param limit Number of submissions to return (max 100)
     * @return List of recent submission responses
     */
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getRecentSubmissions(int limit) {
        try {
            validateLimit(limit);
            return submissionRepository.findAll(
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "submittedAt"))
            ).getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching recent submissions with limit: {}", limit, e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Failed to retrieve recent submissions"
            );
        }
    }

    /**
     * Get a specific submission by ID
     * @param id Submission ID
     * @return Submission response
     */
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(Long id) {
        try {
            validateSubmissionId(id);
            return submissionRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    String.format("Submission not found with ID: %d", id)
                ));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching submission with ID: {}", id, e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to retrieve submission"
            );
        }
    }

    /**
     * Get all submissions for a specific user
     * @param user User entity
     * @return List of user's submission responses
     */
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getUserSubmissions(User user) {
        try {
            validateUser(user);
            return submissionRepository.findByUserId(user.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error fetching submissions for user: {}", user.getUsername(), e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to retrieve user submissions"
            );
        }
    }

    /**
     * Submit code for judging
     * @param user User submitting the code
     * @param request Submission request containing code and problem details
     * @return Submission response
     */
    @Transactional
    public SubmissionResponse submit(User user, SubmissionRequest request) {
        try {
            validateSubmissionRequest(user, request);
            
            Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    String.format("Problem not found with ID: %d", request.getProblemId())
                ));

            Submission submission = createSubmission(user, problem, request);
            submission = submissionRepository.save(submission);
            
            // Trigger async judging - pass the submission entity directly
            // but ensure we flush the transaction first
            submissionRepository.flush();
            processSubmissionAsync(submission);
            
            return convertToResponse(submission);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error processing submission for user: {}, problem: {}", 
                user.getUsername(), request.getProblemId(), e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to process submission"
            );
        }
    }

    @Async
    protected void processSubmissionAsync(Submission submission) {
        try {
            judgeService.judge(submission);
        } catch (Exception e) {
            log.error("Judge service error for submission: {}", submission.getId(), e);
            handleJudgeError(submission.getId());
        }
    }

    private void handleJudgeError(Long submissionId) {
        try {
            Submission submission = submissionRepository.findById(submissionId)
                .orElse(null);
            if (submission != null) {
                submission.setStatus(Submission.Status.JUDGE_ERROR);
                submission.setJudgeOutput("Internal judge service error occurred");
                submissionRepository.save(submission);
            }
        } catch (Exception e) {
            log.error("Failed to update submission status after judge error: {}", 
                submissionId, e);
        }
    }

    private Submission createSubmission(User user, Problem problem, SubmissionRequest request) {
        return Submission.builder()
            .problem(problem)
            .user(user)
            .code(request.getCode())
            .language(request.getLanguage())
            .status(Submission.Status.PENDING)
            .submittedAt(LocalDateTime.now())
            .build();
    }

    private void validateSubmissionRequest(User user, SubmissionRequest request) {
        validateUser(user);
        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Submission request cannot be null"
            );
        }
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Code cannot be empty"
            );
        }
        if (request.getCode().length() > MAX_CODE_LENGTH) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Code exceeds maximum length"
            );
        }
        if (request.getLanguage() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Programming language must be specified"
            );
        }
    }

    private void validateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid user"
            );
        }
    }

    private void validateProblemExists(Long problemId) {
        if (!problemRepository.existsById(problemId)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                String.format("Problem not found with ID: %d", problemId)
            );
        }
    }

    private void validateSubmissionId(Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid submission ID"
            );
        }
    }

    private void validateLimit(int limit) {
        if (limit <= 0 || limit > MAX_RECENT_SUBMISSIONS) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                String.format("Limit must be between 1 and %d", MAX_RECENT_SUBMISSIONS)
            );
        }
    }

    private SubmissionResponse convertToResponse(Submission submission) {
        try {
            return SubmissionResponse.builder()
                .id(submission.getId())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .username(submission.getUser().getUsername())
                .code(submission.getCode())
                .language(submission.getLanguage())
                .status(submission.getStatus().toString())
                .executionTimeMs(submission.getExecutionTimeMs())
                .memoryUsedKb(submission.getMemoryUsedKb())
                .judgeOutput(submission.getJudgeOutput())
                .compileOutput(submission.getCompileOutput())
                .submittedAt(submission.getSubmittedAt())
                .build();
        } catch (Exception e) {
            log.error("Error converting submission to response: {}", submission.getId(), e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to process submission data"
            );
        }
    }
} 