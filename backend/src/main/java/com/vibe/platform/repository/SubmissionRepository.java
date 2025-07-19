package com.vibe.platform.repository;

import com.vibe.platform.model.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByProblemId(Long problemId);
    List<Submission> findByUserId(Long userId);
    Page<Submission> findByProblemId(Long problemId, Pageable pageable);
    Page<Submission> findByUserId(Long userId, Pageable pageable);
} 