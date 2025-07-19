package com.vibe.platform.repository;

import com.vibe.platform.model.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    Page<Problem> findByDifficulty(Problem.Difficulty difficulty, Pageable pageable);

    @Query("SELECT p FROM Problem p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Problem> searchProblems(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT p FROM Problem p WHERE " +
           "(:difficulty IS NULL OR p.difficulty = :difficulty) AND " +
           "(:tag IS NULL OR :tag MEMBER OF p.tags)")
    Page<Problem> findByDifficultyAndTag(
            @Param("difficulty") Problem.Difficulty difficulty,
            @Param("tag") String tag,
            Pageable pageable);
} 