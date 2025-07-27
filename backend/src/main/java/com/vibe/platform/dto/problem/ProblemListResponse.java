package com.vibe.platform.dto.problem;

import com.vibe.platform.model.Problem.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemListResponse {
    private Long id;
    private String title;
    private Difficulty difficulty;
    private List<String> tags;
    private int acceptanceRate;
    private boolean solved;
} 