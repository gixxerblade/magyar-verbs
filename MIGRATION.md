# Verb Migration Guide

This document explains how to migrate the static verb list from `src/data/conjugation.ts` to the Firestore `customVerbs` collection.

## Overview

Currently, 43 verbs are hardcoded in [src/data/conjugation.ts](src/data/conjugation.ts#L63) as `sampleVerbs`. This migration will move them to Firestore so they can be managed dynamically through the Custom Verbs page.

## Migration Steps

### Step 1: Run the Migration Script

Due to Firestore security rules, the migration must be run from the browser console while logged in as an authenticated admin user.

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the app in your browser:**
   - Navigate to http://localhost:5173

3. **Log in as an admin user**

4. **Open the browser console:**
   - Press F12 (Windows/Linux)
   - Press Cmd+Option+J (Mac)

5. **Copy the migration script:**
   - Open [scripts/browser-migration.js](scripts/browser-migration.js)
   - Copy the entire file contents

6. **Paste and run in console:**
   - Paste the copied script into the browser console
   - Press Enter

7. **Wait for completion:**
   - The script will show progress as it migrates all 43 verbs
   - Look for "🎉 Migration complete!" message

8. **Verify migration:**
   - Navigate to the **Custom Verbs** page
   - Confirm all 43 verbs appear in the list

### Step 2: Update Code References

After successful migration, the code needs to be updated to use Firestore verbs instead of the static list.

#### Files Using `sampleVerbs`:

1. **[src/pages/verb-lab.tsx](src/pages/verb-lab.tsx)**
   - Displays verb picker for conjugation exploration
   - Should use `useCustomVerbs()` hook instead

2. **[src/utils/createQuizQuestion.ts](src/utils/createQuizQuestion.ts)**
   - Creates quiz questions using random verbs
   - Should accept verbs as parameter

3. **[src/utils/createFlashcards.ts](src/utils/createFlashcards.ts)**
   - Generates flashcards from verb list
   - Should accept verbs as parameter

4. **[src/utils/createHarmonyChallenge.ts](src/utils/createHarmonyChallenge.ts)**
   - Creates vowel harmony challenges
   - Should accept verbs as parameter

5. **[src/utils/utils.ts](src/utils/utils.ts)**
   - Contains `buildAllForms()` helper
   - Should accept verbs as parameter

#### Required Changes:

**Option A: Keep Static Fallback**
- Keep `sampleVerbs` array as fallback for unauthenticated users
- Merge with custom verbs for authenticated users
- Good for preserving public access to basic features

**Option B: Firestore Only**
- Remove `sampleVerbs` completely
- All features require Firestore data
- Require authentication for verb-based features
- Cleaner architecture, single source of truth

### Step 3: Remove Static List (Option B Only)

If choosing Option B (Firestore only):

1. **Remove the export:**
   - Delete `sampleVerbs` array from [src/data/conjugation.ts](src/data/conjugation.ts#L63-L365)
   - Keep `indefinitePatterns` export (still needed for conjugation rules)

2. **Run tests:**
   ```bash
   npm run tsc
   npm run lint
   npm run build
   ```

## Decision Required

Before proceeding with Step 2, decide which approach to take:

- **Option A (Hybrid):** Keep static list as fallback, merge with custom verbs
- **Option B (Firestore Only):** Remove static list, require Firestore data

## Rollback

If migration fails or needs to be reversed:

1. The static `sampleVerbs` array remains unchanged until Step 3
2. Delete custom verbs from Firestore:
   - Open Firebase Console
   - Navigate to Firestore Database
   - Delete `customVerbs` collection
3. No code changes needed if Step 2 hasn't been completed

## Notes

- **Firestore Rules:** Migration requires authenticated user with proper permissions
- **Batch Size:** Script processes in batches of 500 (Firestore limit)
- **Timestamps:** All migrated verbs get `createdAt` and `updatedAt` timestamps
- **Duplicates:** Running migration multiple times will create duplicate entries

## Questions?

If you encounter any issues during migration, check:
- Firebase authentication status
- Firestore security rules
- Browser console for error messages
