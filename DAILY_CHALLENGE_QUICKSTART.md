# Daily Challenge Feature - Quick Start Guide

## Summary of Changes

Your daily challenge feature is now implemented with the following capabilities:

✅ **Shows "Today's problem solved"** when you've completed the challenge  
✅ **Automatic daily update at 5 AM IST** - resets attempt counter every day  
✅ **3 attempt limit per day** - after 3 failed attempts, you can't try again until tomorrow  
✅ **Attempt tracking** - shows "Attempts: 2/3" in both card and modal  
✅ **Aura rewards** - +20 for solving, +5 for attempting  

## What Changed

### Files Modified
- **app/feed/page.tsx** - Added challenge status tracking and UI changes

### Files Created
- **lib/challengeUtils.ts** - Utility functions for challenge logic
- **migrations/create_challenge_submissions_table.sql** - Database migration
- **DAILY_CHALLENGE_SETUP.md** - Detailed setup guide
- **IMPLEMENTATION_CHECKLIST.md** - Complete implementation checklist

## How It Works

### User Experience Flow

1. **When Challenge is Not Solved**
   ```
   Cyan Card Appears
   ├─ Title: "Daily Mission"
   ├─ Button: "Solve Challenge"
   ├─ Badge: "Attempts: 0/3"
   └─ Click to open modal
   ```

2. **When Submitting Code**
   ```
   Modal Opens
   ├─ Textarea for code entry
   ├─ Click "Run Tests" to submit
   ├─ Shows verification message
   ├─ Shows result: Success or Fail
   ├─ Updates attempt counter
   └─ Can try up to 3 times
   ```

3. **When Solved**
   ```
   Green Badge Appears (replacing cyan card)
   ├─ Shows checkmark ✓
   ├─ Message: "Today's Problem Solved 🎉"
   ├─ Info: "Come back tomorrow at 5 AM IST"
   └─ Persists until 5 AM IST tomorrow
   ```

4. **At 5 AM IST Tomorrow**
   ```
   Automatic Reset
   ├─ Challenge changes to new one
   ├─ Attempt counter resets to 0/3
   ├─ Previous solution removed
   └─ No page refresh needed
   ```

## Quick Setup (2 Steps)

### Step 1: Create Database Table ⚠️ REQUIRED

1. Open Supabase dashboard: https://supabase.com
2. Go to SQL Editor → New Query
3. Paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  submitted_date DATE NOT NULL,
  attempts INTEGER DEFAULT 0,
  is_solved BOOLEAN DEFAULT FALSE,
  last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_challenge_date UNIQUE(user_id, challenge_id, submitted_date)
);

CREATE INDEX idx_challenge_submissions_user_id ON challenge_submissions(user_id);
CREATE INDEX idx_challenge_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX idx_challenge_submissions_submitted_date ON challenge_submissions(submitted_date);

ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON challenge_submissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own submissions" ON challenge_submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own submissions" ON challenge_submissions
  FOR UPDATE USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION update_challenge_submissions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_submissions_update_timestamp
  BEFORE UPDATE ON challenge_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_submissions_timestamp();
```

4. Click "Run"
5. Done! ✅

### Step 2: Test Locally

1. Run: `npm run dev`
2. Go to feed page
3. Click "Solve Challenge"
4. Type code with `*` (like `int *ptr`) and click "Run Tests"
5. See the success message ✅
6. Refresh - should show "Today's Problem Solved"

## Feature Details

### 🎯 Challenge Card States

#### Unsolved (Cyan Card)
```
┌─────────────────────────────────────┐
│  🔤 Daily Mission • C               │
│  Pointer Arithmetic Master          │
│  Create an array of function        │
│  pointers and iterate through them  │
│  [Solve Challenge ▶] [+20 Aura]    │
│  Attempts: 0/3                      │
└─────────────────────────────────────┘
```

#### Solved (Green Badge)
```
┌─────────────────────────────────────┐
│  ✓  Today's Problem Solved 🎉       │
│  Great job! Come back tomorrow      │
│  at 5 AM IST for the next challenge │
│                      [+20 Aura]     │
└─────────────────────────────────────┘
```

### ⏰ Automatic Daily Reset

- **Triggers at:** 5:00 AM IST (Indian Standard Time) every day
- **For users in:** Any timezone (adjusted automatically)
- **What resets:**
  - Attempt counter → 0
  - Challenge status → unattempted
  - Can solve again → Yes
- **What persists:**
  - Aura points earned
  - Historical submissions
  - Streak information (future feature)

### 🎯 Attempt System

| Attempt # | What Happens | Button State |
|-----------|--------------|--------------|
| 1st       | Code submission | Enabled |
| 2nd       | Code submission | Enabled |
| 3rd       | Last chance | Enabled |
| 4th+      | Cannot attempt | **Disabled** |

### 💰 Aura Rewards

| Outcome | Aura Points |
|---------|------------|
| Solve on 1st attempt | +25 |
| Solve on 2nd-3rd attempt | +20 |
| Failed attempt | +5 |

## Technical Details

### How 5 AM IST Reset Works

1. **Calculation:** When page loads, calculates milliseconds until 5 AM IST
2. **Storage:** Timer stored in React state
3. **Trigger:** When timer reaches 0, automatically calls `fetchMission()`
4. **Re-schedule:** Timer resets for next day
5. **Timezone:** Uses IST timezone (UTC+5:30) regardless of user's local time

### Database Structure

```
challenge_submissions table
├── id: UUID (unique identifier)
├── user_id: UUID (who solved it)
├── challenge_id: TEXT (which challenge)
├── submitted_date: DATE (YYYY-MM-DD)
├── attempts: INTEGER (0-3)
├── is_solved: BOOLEAN (true/false)
├── last_attempted_at: TIMESTAMP (when last tried)
├── created_at: TIMESTAMP (when created)
└── updated_at: TIMESTAMP (when updated)
```

### Validation Logic

- **Frontend:** Checks if code contains `*` (pointer symbol in C)
- **Backend:** None currently (recommended: add proper C code validation)

## Next Steps

### Optional Enhancements

1. **Add Streak Tracking**
   - Track consecutive days solved
   - Show "5 day streak 🔥"

2. **Add Leaderboard**
   - Show top solvers
   - Compare with friends

3. **Add Notifications**
   - Browser notifications at 5 AM
   - Email reminders

4. **Add Analytics**
   - Track completion rates
   - Show difficulty trends

5. **Better Validation**
   - Implement proper C code compilation check
   - Test actual code execution

## Troubleshooting

### "Today's Problem Solved" not showing?
- Refresh the page
- Check browser console (F12)
- Verify you solved the challenge (code should have `*`)

### Attempt counter stuck?
- Clear browser cache
- Check Supabase status
- Verify internet connection

### 5 AM IST reset not working?
- Browser tab needs to be open
- Check browser console for errors
- Verify your device time is correct

### Can't submit code?
- Make sure code has `*` for passing
- Check if you have 3 attempts used
- Try refreshing the page

## File Structure

```
devspace-web/
├── app/
│   ├── feed/
│   │   └── page.tsx (MODIFIED)
│   └── components/
├── lib/
│   ├── supabase.ts
│   └── challengeUtils.ts (NEW)
├── migrations/
│   └── create_challenge_submissions_table.sql (NEW)
├── DAILY_CHALLENGE_SETUP.md (NEW)
├── IMPLEMENTATION_CHECKLIST.md (NEW)
└── DAILY_CHALLENGE_QUICKSTART.md (THIS FILE)
```

## Support

**Questions or issues?**
1. Check the browser console (F12)
2. Review DAILY_CHALLENGE_SETUP.md for detailed instructions
3. Check IMPLEMENTATION_CHECKLIST.md for troubleshooting
4. Verify the Supabase table was created correctly

---

**Status:** ✅ Ready to use (after creating the database table)  
**Implementation Date:** May 2026  
**Last Updated:** May 18, 2026
