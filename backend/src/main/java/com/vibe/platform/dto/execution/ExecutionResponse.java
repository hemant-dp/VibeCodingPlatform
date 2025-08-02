package com.vibe.platform.dto.execution;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExecutionResponse {
    private String status;
    private String output;
    private String error;
    private Integer testCasesPassed;
    private Integer totalTestCases;
    private Integer executionTimeMs;
    private Integer memoryUsedKb;
} 