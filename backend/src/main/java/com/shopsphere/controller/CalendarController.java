package com.shopsphere.controller;

import com.shopsphere.dto.request.ScheduleRequest;
import com.shopsphere.dto.response.CalendarResponse;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.CalendarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @PostMapping
    public ResponseEntity<CalendarResponse> scheduleOutfit(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ScheduleRequest request) {
        CalendarResponse response = calendarService.scheduleOutfit(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/month")
    public ResponseEntity<List<CalendarResponse>> getMonthSchedules(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        LocalDate now = LocalDate.now();
        int y = (year != null) ? year : now.getYear();
        int m = (month != null) ? month : now.getMonthValue();
        return ResponseEntity.ok(calendarService.getMonthSchedules(currentUser.getId(), y, m));
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodaySchedule(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return calendarService.getTodaySchedule(currentUser.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<CalendarResponse>> getUpcomingSchedules(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(calendarService.getUpcomingSchedules(currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSchedule(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        calendarService.deleteSchedule(currentUser.getId(), id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Schedule deleted successfully");
        return ResponseEntity.ok(res);
    }
}

