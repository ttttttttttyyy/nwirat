package com.ambulance.app.config;

import com.ambulance.app.request.service.AmbulanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MissionAvailabilityScheduler {

    private final AmbulanceRequestService requestService;

    @Scheduled(fixedRate = 300000)
    public void refreshMissionAvailability() {
        requestService.refreshTodayAvailability();
    }
}
