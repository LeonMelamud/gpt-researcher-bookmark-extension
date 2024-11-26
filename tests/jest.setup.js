import { jest } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
