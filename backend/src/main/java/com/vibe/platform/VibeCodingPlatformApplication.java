package com.vibe.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@EnableAsync
@OpenAPIDefinition(
    info = @Info(
        title = "Vibe Coding Platform API",
        version = "1.0",
        description = "REST API for the Vibe Coding Platform"
    )
)
public class VibeCodingPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(VibeCodingPlatformApplication.class, args);
    }
} 