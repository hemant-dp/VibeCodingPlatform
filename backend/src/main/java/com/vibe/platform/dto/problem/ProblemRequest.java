package com.vibe.platform.dto.problem;

import com.vibe.platform.model.Problem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProblemRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String constraints;

    @NotNull
    private Problem.Difficulty difficulty;

    private List<String> tags;

    private String inputFormat;

    private String outputFormat;

    private List<TestCaseRequest> testCases;

    @Data
    public static class TestCaseRequest {
        @NotBlank
        private String input;

        @NotBlank
        private String expectedOutput;

        private boolean isSample;
    }
} 