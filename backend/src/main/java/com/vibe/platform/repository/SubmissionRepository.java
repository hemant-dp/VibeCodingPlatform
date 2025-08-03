package com.vibe.platform.repository;

import com.vibe.platform.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByProblemId(Long problemId);
    List<Submission> findByUserId(Long userId);
    long countByProblemId(Long problemId);
    long countByProblemIdAndStatus(Long problemId, Submission.Status status);
    boolean existsByProblemIdAndUserUsernameAndStatus(Long problemId, String username, Submission.Status status);
    
    // New methods for activity tracking
    @Query("SELECT s FROM Submission s WHERE s.user.username = :username AND s.submittedAt BETWEEN :startDate AND :endDate ORDER BY s.submittedAt ASC")
    List<Submission> findByUsernameAndSubmittedAtBetween(@Param("username") String username, 
                                                        @Param("startDate") LocalDateTime startDate, 
                                                        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT s FROM Submission s WHERE s.user.username = :username ORDER BY s.submittedAt ASC")
    List<Submission> findByUsernameOrderBySubmittedAtAsc(@Param("username") String username);
} 