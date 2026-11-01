package com.shopsphere.service;

import com.shopsphere.dto.request.ScheduleRequest;
import com.shopsphere.dto.response.CalendarResponse;
import com.shopsphere.entity.*;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final OutfitRepository outfitRepository;
    private final UserRepository userRepository;
    private final WearHistoryRepository wearHistoryRepository;
    private final OutfitService outfitService;

    public CalendarService(CalendarRepository calendarRepository,
                           OutfitRepository outfitRepository,
                           UserRepository userRepository,
                           WearHistoryRepository wearHistoryRepository,
                           OutfitService outfitService) {
        this.calendarRepository = calendarRepository;
        this.outfitRepository = outfitRepository;
        this.userRepository = userRepository;
        this.wearHistoryRepository = wearHistoryRepository;
        this.outfitService = outfitService;
    }

    @Transactional
    public CalendarResponse scheduleOutfit(Long userId, ScheduleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Outfit outfit = outfitRepository.findByIdAndUserId(request.getOutfitId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Outfit not found with id: " + request.getOutfitId()));

        // If a schedule already exists on that date, replace it
        Optional<CalendarSchedule> existingOpt = calendarRepository.findByUserIdAndScheduledDate(userId, request.getScheduledDate());
        CalendarSchedule schedule = existingOpt.orElseGet(CalendarSchedule::new);

        schedule.setUser(user);
        schedule.setOutfit(outfit);
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setOccasion(request.getOccasion() != null && !request.getOccasion().isBlank() ? request.getOccasion() : outfit.getOccasion());
        schedule.setNotes(request.getNotes());

        CalendarSchedule saved = calendarRepository.save(schedule);

        // Record in wear history for the outfit and all its component clothing items
        WearHistory outfitWear = new WearHistory(user, outfit, null, request.getScheduledDate(), "Scheduled wear for " + outfit.getName());
        wearHistoryRepository.save(outfitWear);

        if (outfit.getItems() != null) {
            for (OutfitItem oi : outfit.getItems()) {
                if (oi.getClothingItem() != null) {
                    WearHistory itemWear = new WearHistory(user, outfit, oi.getClothingItem(), request.getScheduledDate(), "Worn in outfit: " + outfit.getName());
                    wearHistoryRepository.save(itemWear);
                }
            }
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CalendarResponse> getMonthSchedules(Long userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<CalendarSchedule> list = calendarRepository.findByUserIdAndScheduledDateBetweenOrderByScheduledDateAsc(userId, start, end);
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CalendarResponse> getTodaySchedule(Long userId) {
        return calendarRepository.findByUserIdAndScheduledDate(userId, LocalDate.now())
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<CalendarResponse> getUpcomingSchedules(Long userId) {
        List<CalendarSchedule> list = calendarRepository.findUpcomingSchedules(userId, LocalDate.now());
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteSchedule(Long userId, Long scheduleId) {
        CalendarSchedule schedule = calendarRepository.findByIdAndUserId(scheduleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar schedule not found with id: " + scheduleId));
        calendarRepository.delete(schedule);
    }

    public CalendarResponse mapToResponse(CalendarSchedule schedule) {
        CalendarResponse res = new CalendarResponse();
        res.setId(schedule.getId());
        res.setOutfitId(schedule.getOutfit().getId());
        res.setOutfitName(schedule.getOutfit().getName());
        res.setOutfit(outfitService.mapToResponse(schedule.getOutfit()));
        res.setScheduledDate(schedule.getScheduledDate());
        res.setOccasion(schedule.getOccasion());
        res.setNotes(schedule.getNotes());
        res.setCreatedAt(schedule.getCreatedAt());
        return res;
    }
}

