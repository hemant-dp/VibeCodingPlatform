package com.vibe.platform.controller;

import com.vibe.platform.model.Submission;
import com.vibe.platform.model.User;
import com.vibe.platform.repository.ProblemRepository;
import com.vibe.platform.repository.SubmissionRepository;
import com.vibe.platform.service.JudgeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "http://localhost:4200")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private JudgeService judgeService;

    @GetMapping
    public List<Submission> getSubmissions(@RequestParam(required = false) Long problemId) {
        if (problemId != null) {
            return submissionRepository.findByProblemId(problemId);
        }
        return submissionRepository.findAll();
    }

    @GetMapping("/recent")
    public List<Submission> getRecentSubmissions(@RequestParam(defaultValue = "5") int limit) {
        return submissionRepository.findAll(
            PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "submittedAt"))
        ).getContent();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long id) {
        return submissionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-submissions")
    public List<Submission> getUserSubmissions(@AuthenticationPrincipal User user) {
        return submissionRepository.findByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<Submission> submit(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SubmissionRequest request) {
        return problemRepository.findById(request.getProblemId())
                .map(problem -> {
                    Submission submission = Submission.builder()
                            .problem(problem)
                            .user(user)
                            .code(request.getCode())
                            .language(request.getLanguage())
                            .status(Submission.Status.PENDING)
                            .build();

                    submission = submissionRepository.save(submission);
                    judgeService.judge(submission);
                    return ResponseEntity.ok(submission);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public static class SubmissionRequest {
        private Long problemId;
        private String code;
        private Submission.Language language;

        public Long getProblemId() {
            return problemId;
        }

        public void setProblemId(Long problemId) {
            this.problemId = problemId;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public Submission.Language getLanguage() {
            return language;
        }

        public void setLanguage(Submission.Language language) {
            this.language = language;
        }
    }
} 