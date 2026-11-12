package com.example.demo.exception;

public class StationConflictException extends RuntimeException {
    public StationConflictException(String message) {
        super(message);
    }
}