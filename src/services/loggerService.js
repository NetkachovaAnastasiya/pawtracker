// src/services/loggerService.js
// EVIDENCE: Technical Process - Code quality assurance fundamentals (Junior)

export const createLoggerService = () => {
    return {
      log: (message, data) => {
        console.log(`[INFO] ${message}`, data);
      },
      warn: (message, data) => {
        console.warn(`[WARN] ${message}`, data);
      },
      error: (message, data) => {
        console.error(`[ERROR] ${message}`, data);
      },
      // Performance logging
      logPerformance: (operationName, startTime) => {
        const endTime = performance.now();
        console.log(`[PERF] ${operationName} took ${endTime - startTime}ms`);
      }
    };
  };