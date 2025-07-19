package com.vibe.platform.dto.problem;

import com.vibe.platform.model.Problem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemResponse {
    private Long id;
    private String title;
    private String description;
    private Problem.Difficulty difficulty;
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private List<String> tags;
    private LocalDateTime createdAt;
    private List<TestCaseResponse> testCases;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCaseResponse {
        private Long id;
        private String input;
        private String expectedOutput;
        private boolean isSample;
    }
} 