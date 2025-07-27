package com.vibe.platform.dto.submission;

import com.vibe.platform.model.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String username;
    private String code;
    private Submission.Language language;
    private String status;
    private Integer executionTimeMs;
    private Integer memoryUsedKb;
    private String judgeOutput;
    private String compileOutput;
    private LocalDateTime submittedAt;
} 