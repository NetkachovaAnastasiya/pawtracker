// EVIDENCE: Technical Process - Technical debt management (Middle)
const loggerMiddleware = (services) => (store) => (next) => (action) => {
    const { logger } = services;
    
    logger.log('Redux action dispatched', { 
      type: action.type, 
      payload: action.payload 
    });
    
    // Вимірювання продуктивності для кожної дії
    const startTime = performance.now();
    const result = next(action);
    logger.logPerformance(`Redux action ${action.type}`, startTime);
    
    return result;
  };
  
  export default loggerMiddleware;