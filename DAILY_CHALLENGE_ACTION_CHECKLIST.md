# Daily Challenge - Action Checklist

Print this page and check off each item as you complete it.

---

## 🚀 IMMEDIATE SETUP (Do This First)

### Step 1: Create Database Table
- [ ] Go to https://supabase.com and login
- [ ] Open your project dashboard
- [ ] Navigate to SQL Editor
- [ ] Click "New Query"
- [ ] Open file: `migrations/create_challenge_submissions_table.sql`
- [ ] Copy ALL the SQL code
- [ ] Paste into the Supabase SQL editor
- [ ] Click "Run"
- [ ] Wait for success message ✅
- [ ] Verify table exists by running: `SELECT COUNT(*) FROM challenge_submissions;`

### Step 2: Test Locally
- [ ] Run: `npm run dev`
- [ ] Open browser to: http://localhost:3000/feed
- [ ] You should see the cyan "Daily Mission" card
- [ ] Click "Solve Challenge" button
- [ ] Type code in the modal: `int *ptr;`
- [ ] Click "Run Tests" button
- [ ] Verify success message appears ✅
- [ ] Close modal
- [ ] Refresh page (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Verify green "Today's Problem Solved" badge appears ✅

### Step 3: Verify Attempt System
- [ ] Click "Solve Challenge" again
- [ ] Try submitting code WITHOUT asterisk (e.g., `int x;`)
- [ ] Verify it shows as failed ❌
- [ ] Click "Close" button
- [ ] Click "Solve Challenge" again (2nd time)
- [ ] Try submitting without asterisk again
- [ ] Verify it shows as failed ❌
- [ ] Click "Close" button
- [ ] Click "Solve Challenge" again (3rd time)
- [ ] Try submitting without asterisk one more time
- [ ] Verify it shows as failed ❌
- [ ] Check that "Solve Challenge" button is now DISABLED ❌
- [ ] Verify attempt counter shows "3/3" in red

---

## 📋 DOCUMENTATION REVIEW

### Reading Required Documentation
- [ ] Read: `DAILY_CHALLENGE_QUICKSTART.md` (10 min)
- [ ] Read: `DAILY_CHALLENGE_SETUP.md` (15 min)
- [ ] Read: `DAILY_CHALLENGE_UI_GUIDE.md` (5 min)
- [ ] Skim: `IMPLEMENTATION_CHECKLIST.md` (5 min)

### Understanding the Code
- [ ] Review modified: `app/feed/page.tsx`
- [ ] Review created: `lib/challengeUtils.ts`
- [ ] Review created: `migrations/create_challenge_submissions_table.sql`

---

## 🔍 VERIFICATION TESTS

### Database Verification
Run these queries in Supabase SQL Editor:

- [ ] Query 1: Check table exists
  ```sql
  SELECT * FROM challenge_submissions LIMIT 1;
  ```
  Expected: No errors, returns empty or data

- [ ] Query 2: Check RLS policies
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'challenge_submissions';
  ```
  Expected: Shows 3 policies

- [ ] Query 3: Check indexes
  ```sql
  SELECT * FROM pg_indexes WHERE tablename = 'challenge_submissions';
  ```
  Expected: Shows 3 indexes

### UI Verification
- [ ] Cyan card appears with challenge info
- [ ] Button text says "Solve Challenge ▶"
- [ ] Aura badge shows "+20 Aura"
- [ ] Attempt counter shows "0/3" initially
- [ ] Modal opens on button click
- [ ] Textarea is focused and ready for input
- [ ] "Run Tests" button is enabled
- [ ] Success message is green and clear
- [ ] Failure message is red and clear
- [ ] Green badge appears after successful solve
- [ ] Attempt counter updates correctly

### Functionality Verification
- [ ] Can submit code on 1st attempt
- [ ] Can submit code on 2nd attempt
- [ ] Can submit code on 3rd attempt
- [ ] Button disables on 4th attempt
- [ ] Aura points are awarded (+20 for solve, +5 for fail)
- [ ] Solve status persists after refresh
- [ ] Attempt count persists after refresh
- [ ] Green badge persists after refresh

---

## 🚀 DEPLOYMENT PREPARATION

### Security Checklist
- [ ] Verified RLS policies are enabled
- [ ] Confirmed user_id validation working
- [ ] Tested with multiple users (if available)
- [ ] Checked that users only see their own data
- [ ] Verified timestamps are correct timezone

### Performance Checklist
- [ ] Tested with 5+ rapid submissions
- [ ] No database errors in console
- [ ] No SQL errors in Supabase logs
- [ ] UI remains responsive
- [ ] No memory leaks observed
- [ ] Page loads in < 2 seconds

### Browser Compatibility
- [ ] Works on Chrome/Chromium
- [ ] Works on Firefox
- [ ] Works on Safari (if on Mac)
- [ ] Works on Edge
- [ ] Mobile responsive (if mobile available)

---

## 📱 OPTIONAL: ADVANCED TESTING

### Testing Timezone Handling
- [ ] Note current time in IST
- [ ] Calculate: When is next 5 AM IST?
- [ ] (Optional) Modify `getTimeUntilFiveAMIST()` for testing
- [ ] Wait for timer to trigger reset
- [ ] Verify challenge resets
- [ ] Don't forget to revert code change!

### Testing Edge Cases
- [ ] Submit exactly at 3 AM (if possible)
- [ ] Submit exactly at 5 AM IST (if possible)
- [ ] Test with different browsers
- [ ] Test with VPN (changes timezone)
- [ ] Test with browser dev tools throttling

### Testing Aura System
- [ ] Check initial aura points in database
- [ ] Solve a challenge successfully
- [ ] Verify aura increased by 20
- [ ] Fail a challenge attempt
- [ ] Verify aura increased by 5
- [ ] Check user table in Supabase: `SELECT aura_points FROM users WHERE id = '[YOUR_ID]';`

---

## 🎯 BEFORE GOING TO PRODUCTION

### Code Quality
- [ ] No console errors (F12)
- [ ] No console warnings
- [ ] TypeScript compiles without errors
- [ ] ESLint passes all checks
- [ ] Code is properly commented

### Documentation
- [ ] All documentation files are present
- [ ] Documentation is up to date
- [ ] README mentions daily challenges
- [ ] Team is aware of new feature

### Monitoring Setup
- [ ] Know how to view Supabase logs
- [ ] Know how to run monitoring queries
- [ ] Set up alerts if available
- [ ] Have backup of database

### User Communication
- [ ] Prepare user announcement
- [ ] Create tutorial if needed
- [ ] Add help documentation
- [ ] Test with beta users first

---

## 🎉 DEPLOYMENT

### Pre-Deployment
- [ ] All items above completed ✅
- [ ] Team review completed
- [ ] Backup taken
- [ ] Rollback plan ready

### Deployment Steps
- [ ] Merge code to production branch
- [ ] Deploy to production
- [ ] Run post-deployment verification
- [ ] Monitor error logs
- [ ] Check database connections
- [ ] Announce to users

### Post-Deployment
- [ ] Feature works in production
- [ ] Monitor for 24 hours
- [ ] Check user feedback
- [ ] Verify 5 AM IST reset (next day)
- [ ] Review completion rate (if possible)

---

## 🐛 TROUBLESHOOTING LOG

Use this space to document any issues encountered:

### Issue #1
**Problem:** [Describe issue]
**Resolution:** [How you fixed it]
**Timestamp:** [When this happened]

---

### Issue #2
**Problem:** [Describe issue]
**Resolution:** [How you fixed it]
**Timestamp:** [When this happened]

---

### Issue #3
**Problem:** [Describe issue]
**Resolution:** [How you fixed it]
**Timestamp:** [When this happened]

---

## 📊 COMPLETION SUMMARY

Total items in this checklist: **73**

Items completed: _____ / 73 (____%)

### By Section:
- Immediate Setup: _____ / 8
- Documentation Review: _____ / 5
- Verification Tests: _____ / 22
- Deployment Prep: _____ / 13
- Advanced Testing: _____ / 8
- Production Checklist: _____ / 12
- Deployment: _____ / 5

---

## ✅ SIGN OFF

**Implemented By:** _____________________

**Date:** _____________________

**Tested By:** _____________________

**Date:** _____________________

**Approved For Production:** ___________

**Date:** _____________________

---

## 📞 CONTACT INFO

For questions or issues:
1. Check documentation files
2. Review browser console (F12)
3. Check Supabase logs
4. Contact development team

---

**Print Date:** _____________________

**Last Verified:** _____________________

**Next Review Date:** _____________________
