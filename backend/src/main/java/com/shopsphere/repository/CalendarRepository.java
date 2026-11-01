package com.shopsphere.repository;

import com.shopsphere.entity.CalendarSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<CalendarSchedule, Long> {

    List<CalendarSchedule> findByUserIdAndScheduledDateBetweenOrderByScheduledDateAsc(Long userId, LocalDate start, LocalDate end);

    Optional<CalendarSchedule> findByUserIdAndScheduledDate(Long userId, LocalDate scheduledDate);

    Optional<CalendarSchedule> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT c FROM CalendarSchedule c WHERE c.user.id = :userId AND c.scheduledDate >= :date ORDER BY c.scheduledDate ASC")
    List<CalendarSchedule> findUpcomingSchedules(@Param("userId") Long userId, @Param("date") LocalDate date);

    long countByUserId(Long userId);
}

