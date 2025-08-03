package com.vibe.platform.service;

import com.vibe.platform.dto.ActivityDataDTO;
import com.vibe.platform.dto.ActivitySummaryDTO;
import com.vibe.platform.model.Submission;
import com.vibe.platform.repository.SubmissionRepository;
import com.vibe.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ActivityDataDTO> getMonthlyActivity(String username, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        return getActivityRange(username, startDate, endDate);
    }

    public List<ActivityDataDTO> getActivityRange(String username, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        System.out.println("Querying submissions for user: " + username + " from " + startDateTime + " to " + endDateTime);
        
        List<Submission> submissions = submissionRepository.findByUsernameAndSubmittedAtBetween(
                username, startDateTime, endDateTime);
        
        System.out.println("Found " + submissions.size() + " submissions");
        
        // Log submission dates
        for (Submission submission : submissions) {
            System.out.println("Submission: " + submission.getId() + " at " + submission.getSubmittedAt());
        }
        
        // Group submissions by date
        Map<LocalDate, List<Submission>> submissionsByDate = submissions.stream()
                .collect(Collectors.groupingBy(s -> s.getSubmittedAt().toLocalDate()));
        
        System.out.println("Grouped submissions by date: " + submissionsByDate.keySet());
        
        List<ActivityDataDTO> result = new ArrayList<>();
        
        // Generate activity data for each date in range
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            List<Submission> daySubmissions = submissionsByDate.getOrDefault(currentDate, new ArrayList<>());
            
            int submissionCount = daySubmissions.size();
            int acceptedCount = (int) daySubmissions.stream()
                    .filter(s -> s.getStatus() == Submission.Status.ACCEPTED)
                    .count();
            int totalProblems = (int) daySubmissions.stream()
                    .map(s -> s.getProblem().getId())
                    .distinct()
                    .count();
            
            // Always add the data, even if submissionCount is 0
            result.add(new ActivityDataDTO(currentDate, submissionCount, acceptedCount, totalProblems));
            
            currentDate = currentDate.plusDays(1);
        }
        
        return result;
    }

    public ActivitySummaryDTO getActivitySummary(String username) {
        List<Submission> allSubmissions = submissionRepository.findByUsernameOrderBySubmittedAtAsc(username);
        
        int totalSubmissions = allSubmissions.size();
        int totalAccepted = (int) allSubmissions.stream()
                .filter(s -> s.getStatus() == Submission.Status.ACCEPTED)
                .count();
        
        // Calculate streaks and active days
        Set<LocalDate> activeDates = allSubmissions.stream()
                .map(s -> s.getSubmittedAt().toLocalDate())
                .collect(Collectors.toSet());
        
        int activeDays = activeDates.size();
        int currentStreak = calculateCurrentStreak(activeDates);
        int longestStreak = calculateLongestStreak(activeDates);
        
        return new ActivitySummaryDTO(totalSubmissions, totalAccepted, currentStreak, longestStreak, activeDays);
    }

    public List<ActivityDataDTO> getYearlyActivity(String username, int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        
        return getActivityRange(username, startDate, endDate);
    }

    private int calculateCurrentStreak(Set<LocalDate> activeDates) {
        if (activeDates.isEmpty()) {
            return 0;
        }
        
        LocalDate today = LocalDate.now();
        LocalDate checkDate = today;
        int streak = 0;
        
        // Check if there's activity today or yesterday (to account for timezone differences)
        if (!activeDates.contains(today) && !activeDates.contains(today.minusDays(1))) {
            return 0;
        }
        
        // Start from yesterday if no activity today
        if (!activeDates.contains(today)) {
            checkDate = today.minusDays(1);
        }
        
        // Count consecutive days backwards
        while (activeDates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }
        
        return streak;
    }

    private int calculateLongestStreak(Set<LocalDate> activeDates) {
        if (activeDates.isEmpty()) {
            return 0;
        }
        
        List<LocalDate> sortedDates = activeDates.stream()
                .sorted()
                .collect(Collectors.toList());
        
        int maxStreak = 1;
        int currentStreak = 1;
        
        for (int i = 1; i < sortedDates.size(); i++) {
            LocalDate prevDate = sortedDates.get(i - 1);
            LocalDate currentDate = sortedDates.get(i);
            
            if (ChronoUnit.DAYS.between(prevDate, currentDate) == 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        
        return maxStreak;
    }
}
