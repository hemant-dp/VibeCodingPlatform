package com.vibe.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private Integer executionTimeMs;

    private Integer memoryUsedKb;

    @Column(columnDefinition = "TEXT")
    private String judgeOutput;

    @Column(columnDefinition = "TEXT")
    private String compileOutput;

    @CreationTimestamp
    private LocalDateTime submittedAt;

    public enum Language {
        JAVA,
        PYTHON,
        CPP,
        JAVASCRIPT
    }

    public enum Status {
        PENDING,
        RUNNING,
        ACCEPTED,
        WRONG_ANSWER,
        TIME_LIMIT_EXCEEDED,
        MEMORY_LIMIT_EXCEEDED,
        RUNTIME_ERROR,
        COMPILATION_ERROR,
        JUDGE_ERROR,
        COMPILING
    }
} 