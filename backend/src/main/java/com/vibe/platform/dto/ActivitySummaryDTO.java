package com.vibe.platform.dto;

public class ActivitySummaryDTO {
    private int totalSubmissions;
    private int totalAccepted;
    private int currentStreak;
    private int longestStreak;
    private int activeDays;

    public ActivitySummaryDTO() {}

    public ActivitySummaryDTO(int totalSubmissions, int totalAccepted, int currentStreak, int longestStreak, int activeDays) {
        this.totalSubmissions = totalSubmissions;
        this.totalAccepted = totalAccepted;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.activeDays = activeDays;
    }

    // Getters and Setters
    public int getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(int totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public int getTotalAccepted() {
        return totalAccepted;
    }

    public void setTotalAccepted(int totalAccepted) {
        this.totalAccepted = totalAccepted;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public int getActiveDays() {
        return activeDays;
    }

    public void setActiveDays(int activeDays) {
        this.activeDays = activeDays;
    }
}
