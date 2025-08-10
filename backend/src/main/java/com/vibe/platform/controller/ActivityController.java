package com.vibe.platform.controller;

import com.vibe.platform.dto.ActivityDataDTO;
import com.vibe.platform.dto.ActivitySummaryDTO;
import com.vibe.platform.service.ActivityService;
import com.vibe.platform.model.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/monthly")
    public ResponseEntity<List<ActivityDataDTO>> getMonthlyActivity(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication) {
        
        // TEMPORARY: Disable authentication for activity endpoints
        String username = "anonymous"; // TODO: Replace with a real username that exists in your database submissions
        System.out.println("Getting monthly activity for user: " + username + ", year: " + year + ", month: " + month);
        
        List<ActivityDataDTO> activityData = activityService.getMonthlyActivity(username, year, month);
        System.out.println("Returned " + activityData.size() + " activity records");
        
        // Log each activity record
        for (ActivityDataDTO activity : activityData) {
            if (activity.getSubmissionCount() > 0) {
                System.out.println("Activity: " + activity.getDate() + " - " + activity.getSubmissionCount() + " submissions");
            }
        }
        
        return ResponseEntity.ok(activityData);
    }

    @GetMapping("/submissions-by-date")
    public ResponseEntity<List<Submission>> getSubmissionsByDate(
            @RequestParam String date) {
        // TEMPORARY: Use the same hardcoded username as elsewhere
        String username = "anonymous"; // TODO: Replace with a real username that exists in your database submissions
        LocalDate targetDate = LocalDate.parse(date);
        LocalDateTime start = targetDate.atStartOfDay();
        LocalDateTime end = targetDate.atTime(23, 59, 59);
        List<Submission> submissions = submissionRepository.findByUsernameAndSubmittedAtBetween(username, start, end);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ActivityDataDTO>> getActivityRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        
        String username = authentication.getName();
        List<ActivityDataDTO> activityData = activityService.getActivityRange(username, startDate, endDate);
        return ResponseEntity.ok(activityData);
    }

    @GetMapping("/summary")
    public ResponseEntity<ActivitySummaryDTO> getActivitySummary(Authentication authentication) {
        String username = authentication.getName();
        ActivitySummaryDTO summary = activityService.getActivitySummary(username);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/yearly")
    public ResponseEntity<List<ActivityDataDTO>> getYearlyActivity(
            @RequestParam int year,
            Authentication authentication) {
        
        String username = authentication.getName();
        List<ActivityDataDTO> activityData = activityService.getYearlyActivity(username, year);
        return ResponseEntity.ok(activityData);
    }
}
