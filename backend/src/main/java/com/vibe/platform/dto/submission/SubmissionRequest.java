package com.vibe.platform.dto.submission;

import com.vibe.platform.model.Submission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequest {
    @NotNull(message = "Problem ID is required")
    private Long problemId;
    
    @NotBlank(message = "Code cannot be empty")
    private String code;
    
    @NotNull(message = "Programming language must be specified")
    private Submission.Language language;
} 