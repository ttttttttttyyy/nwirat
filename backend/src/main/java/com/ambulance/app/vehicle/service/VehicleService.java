package com.ambulance.app.vehicle.service;

import com.ambulance.app.vehicle.entity.Vehicle;
import com.ambulance.app.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailableTrue();
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle existing = getVehicleById(id);
        existing.setPlateNumber(vehicle.getPlateNumber());
        existing.setModel(vehicle.getModel());
        existing.setType(vehicle.getType());
        existing.setAvailable(vehicle.isAvailable());
        existing.setStatus(vehicle.getStatus());
        existing.setCurrentLocation(vehicle.getCurrentLocation());
        return vehicleRepository.save(existing);
    }
}
