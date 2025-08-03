package com.vibe.platform.dto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ActivityDataDTO {
    private String date; // Use String to ensure YYYY-MM-DD format
    private int submissionCount;
    private int acceptedCount;
    private int totalProblems;

    public ActivityDataDTO() {}

    public ActivityDataDTO(LocalDate date, int submissionCount, int acceptedCount, int totalProblems) {
        this.date = date.format(DateTimeFormatter.ISO_LOCAL_DATE); // Ensures YYYY-MM-DD format
        this.submissionCount = submissionCount;
        this.acceptedCount = acceptedCount;
        this.totalProblems = totalProblems;
    }

    // Getters and Setters
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(int submissionCount) {
        this.submissionCount = submissionCount;
    }

    public int getAcceptedCount() {
        return acceptedCount;
    }

    public void setAcceptedCount(int acceptedCount) {
        this.acceptedCount = acceptedCount;
    }

    public int getTotalProblems() {
        return totalProblems;
    }

    public void setTotalProblems(int totalProblems) {
        this.totalProblems = totalProblems;
    }
}
