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
  // Get current time in IST timezone
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  // Create a date object for 5 AM IST
  const nextFiveAM = new Date(istTime);
  nextFiveAM.setHours(5, 0, 0, 0);
  
  // If it's already past 5 AM today, schedule for tomorrow
  if (nextFiveAM <= istTime) {
    nextFiveAM.setDate(nextFiveAM.getDate() + 1);
  }
  
  // Return milliseconds until next 5 AM IST
  return nextFiveAM.getTime() - istTime.getTime();
}

/**
 * Get today's date in YYYY-MM-DD format (IST timezone)
 * @returns {string} Today's date in IST
 */
export function getTodayDateIST(): string {
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return istTime.toISOString().split('T')[0];
}

/**
 * Get next 5 AM IST as a Date object
 * @returns {Date} Next 5 AM IST
 */
export function getNextFiveAMIST(): Date {
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  const nextFiveAM = new Date(istTime);
  nextFiveAM.setHours(5, 0, 0, 0);
  
  if (nextFiveAM <= istTime) {
    nextFiveAM.setDate(nextFiveAM.getDate() + 1);
  }
  
  return nextFiveAM;
}

/**
 * Check if a challenge is solved for today
 * @param {any} challengeStatus - Challenge submission record
 * @returns {boolean} True if challenge is solved today
 */
export function isChallengeCompletedToday(challengeStatus: any): boolean {
  if (!challengeStatus) return false;
  
  const today = getTodayDateIST();
  return (
    challengeStatus.submitted_date === today &&
    challengeStatus.is_solved === true
  );
}

/**
 * Get remaining attempts for today's challenge
 * @param {number} currentAttempts - Current number of attempts made
 * @param {number} maxAttempts - Maximum allowed attempts (default: 3)
 * @returns {number} Remaining attempts
 */
export function getRemainingAttempts(
  currentAttempts: number,
  maxAttempts: number = 3
): number {
  return Math.max(0, maxAttempts - currentAttempts);
}

/**
 * Check if user can attempt the challenge
 * @param {number} currentAttempts - Current number of attempts
 * @param {number} maxAttempts - Maximum allowed attempts
 * @returns {boolean} True if user can attempt
 */
export function canAttemptChallenge(
  currentAttempts: number,
  maxAttempts: number = 3
): boolean {
  return currentAttempts < maxAttempts;
}

/**
 * Format time remaining until 5 AM IST
 * @returns {string} Human-readable time remaining
 */
export function formatTimeUntilFiveAM(): string {
  const ms = getTimeUntilFiveAMIST();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

/**
 * Create a new challenge submission record
 * @param {string} userId - User ID
 * @param {string} challengeId - Challenge ID
 * @param {boolean} isSolved - Whether the challenge was solved
 * @returns {object} Challenge submission record
 */
export function createChallengeSubmission(
  userId: string,
  challengeId: string,
  isSolved: boolean = false
): object {
  return {
    user_id: userId,
    challenge_id: challengeId,
    submitted_date: getTodayDateIST(),
    attempts: 1,
    is_solved: isSolved,
    last_attempted_at: new Date().toISOString(),
  };
}

/**
 * Calculate aura points for challenge submission
 * @param {boolean} isSolved - Whether the challenge was solved
 * @param {number} attempts - Number of attempts used
 * @returns {number} Aura points earned
 */
export function calculateAuraPoints(
  isSolved: boolean,
  attempts: number = 1
): number {
  if (isSolved) {
    // Bonus for solving on first attempt
    return attempts === 1 ? 25 : 20;
  }
  // Points for attempting
  return 5;
}

/**
 * Get challenge difficulty level based on title
 * @param {string} title - Challenge title
 * @returns {string} Difficulty level: 'Easy', 'Medium', 'Hard'
 */
export function getChallengeDifficulty(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (
    lowerTitle.includes('easy') ||
    lowerTitle.includes('basic') ||
    lowerTitle.includes('simple')
  ) {
    return 'Easy';
  }
  
  if (
    lowerTitle.includes('hard') ||
    lowerTitle.includes('advanced') ||
    lowerTitle.includes('master')
  ) {
    return 'Hard';
  }
  
  return 'Medium';
}

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
  
  if (language === 'C' || language === 'C++') {
    // Simple check for pointer syntax
    return code.includes('*');
  }
  
  // Default: code must have content
  return code.trim().length > 0;
}

/**
 * Format challenge completion message
 * @param {boolean} isSolved - Whether the challenge was solved
 * @param {number} attempts - Number of attempts used
 * @returns {string} Formatted message
 */
export function getCompletionMessage(isSolved: boolean, attempts: number): string {
  if (isSolved) {
    if (attempts === 1) {
      return '🎉 Perfect! Solved on first attempt!';
    }
    if (attempts <= 3) {
      return `✅ Great job! Solved in ${attempts} attempts.`;
    }
    return `✅ Excellent! You persevered and solved it!`;
  }
  
  return '💪 Good attempt! Keep trying!';
}

// Export a debug function for testing
export function debugChallengeTimings(): void {
  console.log('=== Challenge Debug Info ===');
  console.log('Current time (IST):', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  console.log('Next 5 AM IST:', getNextFiveAMIST().toLocaleString());
  console.log('Time until 5 AM IST:', formatTimeUntilFiveAM());
  console.log('Today\'s date (IST):', getTodayDateIST());
  console.log('============================');
}
