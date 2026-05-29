# Daily Challenge Feature - Setup Guide

## Overview
This implementation adds a daily challenge system with the following features:
- ✅ Show "Today's problem solved" when a challenge is completed
- ✅ Automatically updates at 5 AM IST every day
- ✅ Maximum 3 attempts per challenge per day
- ✅ Track attempt history and completion status

## Database Setup

### Step 1: Run the Migration
You need to create the `challenge_submissions` table in your Supabase database.

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Click "New Query"
4. Copy the contents of `migrations/create_challenge_submissions_table.sql`
5. Paste into the editor and click "Run"

**Option B: Using Supabase CLI**
```bash
supabase db push
```

### Step 2: Verify the Table
Run this query to verify the table was created:
```sql
SELECT * FROM challenge_submissions LIMIT 1;
```

## How It Works

### Challenge Status Logic
1. **On Page Load**: Fetches today's challenge and checks if the user has already solved it
2. **If Solved**: Shows a green "Today's problem solved" badge
3. **If Not Solved**: Shows the challenge card with attempt counter
4. **After Submission**: Updates the database with the attempt count and completion status

### Automatic Daily Reset (5 AM IST)
- A JavaScript timer runs on the client that calculates the time until 5 AM IST
- At 5 AM IST, it automatically fetches a new challenge
- The user's attempt counter resets for the new challenge
- This happens silently in the background without requiring a page refresh

### Attempt Tracking
- **Max Attempts**: 3 per challenge per day
- **Tracking**: Each submission records the attempt number
- **Feedback**: Shows remaining attempts to the user
- **After Max Attempts**: "Solve Challenge" button becomes disabled with red styling

## Frontend Components Updated

### Feed Page (`app/feed/page.tsx`)
- Added `challengeStatus` state to track submission data
- Added `getTimeUntilFiveAMIST()` helper function
- Added automatic refresh schedule using `useEffect`
- Updated `fetchMission()` to include challenge status lookup

### DailyMissionBox Component
- **New Logic**: Shows different UI based on `isSolved` status
- **Solved State**: Green badge with success message
- **Unsolved State**: Cyan challenge card with attempt counter
- **Attempt Tracking**: Displays "Attempts: X/3" in both card and modal
- **Max Attempts**: Disables button when 3 attempts are reached
- **Submission Logic**: Updates database with attempt count and completion status

## Database Schema

### `challenge_submissions` Table
```sql
id                  UUID (Primary Key)
user_id            UUID (Foreign Key to users)
challenge_id       TEXT (ID of the challenge)
submitted_date     DATE (YYYY-MM-DD format)
attempts           INTEGER (0-3, default 0)
is_solved          BOOLEAN (default false)
last_attempted_at  TIMESTAMP WITH TIME ZONE
created_at         TIMESTAMP WITH TIME ZONE
updated_at         TIMESTAMP WITH TIME ZONE

UNIQUE CONSTRAINT: user_id + challenge_id + submitted_date
```

## Testing the Feature

### Local Testing
1. Open the feed page
2. You should see the daily challenge card
3. Click "Solve Challenge"
4. Type some code with an asterisk `*` to pass the test
5. Click "Run Tests"
6. You should see the success message and the card should show as solved on refresh

### Testing 5 AM IST Reset
To test without waiting for 5 AM:
1. Modify the `getTimeUntilFiveAMIST()` function temporarily
2. Change `5` to a different hour (e.g., current hour + 1 minute)
3. Verify the challenge resets at the scheduled time
4. Don't forget to change it back!

## Key Features Implemented

### ✅ Challenge Completion Display
- Green "Today's problem solved" badge shows when the challenge is completed
- Displays motivational message: "Great job! Come back tomorrow at 5 AM IST for the next challenge."

### ✅ Automatic Daily Update
- Calculates time until 5 AM IST in the user's local timezone
- Automatically fetches new challenge at scheduled time
- Works even if the browser is closed and reopened (timer resets on next visit)

### ✅ Attempt Limiting
- Maximum 3 attempts per challenge per day
- Displays attempt counter: "Attempts: 2/3"
- Disables "Solve Challenge" button when max attempts reached
- Shows "Max attempts reached!" message after 3rd failed attempt

### ✅ Aura Points
- Successful completion: +20 Aura points
- Failed attempt: +5 Aura points
- Updated in the `users` table immediately after submission

## Future Enhancements

1. **Streak System**: Track consecutive days of challenge completion
2. **Leaderboard**: Show top performers for the week/month
3. **Challenge Difficulty**: Add multiple difficulty levels
4. **Hints System**: Provide hints after failed attempts
5. **Mobile Notifications**: Notify users at 5 AM to complete the daily challenge
6. **Historical Data**: Show completed challenges from previous days

## Troubleshooting

### Challenge not updating at 5 AM
- Check browser console for errors
- Verify user's timezone is set correctly
- Make sure the browser tab is open (background tabs may pause timers)
- Check that `getTimeUntilFiveAMIST()` is calculating correctly

### Attempt counter not updating
- Clear browser cache
- Verify `challenge_submissions` table exists in Supabase
- Check Supabase RLS policies are allowing the insert/update
- Check browser console for database errors

### "Today's problem solved" not showing
- Verify the `challenge_submissions` record was created
- Check the `is_solved` flag is set to `true`
- Verify the `submitted_date` matches today's date

## Security Notes

- RLS policies ensure users can only view/update their own submissions
- Validation happens on the frontend (for UX) and should be validated on the backend
- Current challenge logic uses simple pointer syntax check - implement proper validation server-side
