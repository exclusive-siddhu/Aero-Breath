package com.example.demo.exception;

public class SensorStationNotFoundException extends RuntimeException {
    public SensorStationNotFoundException(String message) {
        super(message);
    }
}