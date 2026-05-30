/**
 * Daily Challenge Utility Functions
 * Helper functions for managing daily challenges and attempt tracking
 */

/**
 * Calculate the time (in milliseconds) until 5 AM IST
 * @returns {number} Milliseconds until next 5 AM IST
 */
export function getTimeUntilFiveAMIST(): number {
  const now = new Date();
  // Calculate IST time (UTC+5:30)
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000));
  
  // Create a date object for 5 AM IST
  const nextFiveAM = new Date(istTime);
  nextFiveAM.setHours(5, 0, 0, 0);
  
  // If it's already past 5 AM today, schedule for tomorrow
  if (nextFiveAM <= istTime) {
    nextFiveAM.setDate(nextFiveAM.getDate() + 1);
  }
  
  // Return milliseconds until next 5 AM IST
  return Math.max(0, nextFiveAM.getTime() - istTime.getTime());
}

/**
 * Get today's date in YYYY-MM-DD format (IST timezone)
 * @returns {string} Today's date in IST
 */
export function getTodayDateIST(): string {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000));
  
  const year = istTime.getFullYear();
  const month = String(istTime.getMonth() + 1).padStart(2, '0');
  const day = String(istTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Get next 5 AM IST as a Date object
 * @returns {Date} Next 5 AM IST
 */
export function getNextFiveAMIST(): Date {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000));
  
  const nextFiveAM = new Date(istTime);
  nextFiveAM.setHours(5, 0, 0, 0);
  
  if (nextFiveAM <= istTime) {
    nextFiveAM.setDate(nextFiveAM.getDate() + 1);
  }
  
  return nextFiveAM;
}

// ...existing code...

/**
 * Validate challenge submission code
 * Simple validation - can be replaced with backend validation
 * @param {string} code - Code to validate
 * @param {string} language - Programming language
 * @returns {boolean} Whether the code is valid
 */
export function validateChallengeCode(code: string, language: string = 'C'): boolean {
  if (!code || code.trim().length === 0) {
    return false;
  }
  
  // Default: code must have content (remove strict pointer requirement)
  return code.trim().length > 0;
}

// ...rest of existing code...