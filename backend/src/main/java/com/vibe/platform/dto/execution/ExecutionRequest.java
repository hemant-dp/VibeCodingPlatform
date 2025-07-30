package com.vibe.platform.dto.execution;

import lombok.Data;

@Data
public class ExecutionRequest {
    private Long problemId;
    private String code;
    private String language;
} 