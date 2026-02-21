## 1. Baseline + Environment Verification

- [x] 1.1 Verify local Supabase stack is healthy (`pnpm supabase:verify`)
- [x] 1.2 Locate existing web sign-in route/components and Supabase client wiring

## 2. Signup UI Flow (Web)

- [x] 2.1 Add a dedicated signup page/route with email + password form
- [x] 2.2 Add navigation between sign-in and signup screens (links + consistent layout)
- [x] 2.3 Implement signup submission using Supabase Auth `signUp` and show loading/disabled states
- [x] 2.4 Handle confirmation-required outcome (no session): show "check your email" messaging and next-step CTA to sign in
- [x] 2.5 Handle immediate-session outcome: treat user as signed in and route to the signed-in landing destination
- [x] 2.6 Normalize and display signup errors (invalid email, weak password, existing email)

## 3. Password Reset / Forgot Password (Web)

- [x] 3.1 Add a "forgot password" entry point from sign-in UI
- [x] 3.2 Add a reset-request page/route (email input) using Supabase reset password email flow
- [x] 3.3 Add an update-password page/route for the reset link to land on
- [x] 3.4 Implement password update submission + success state + routing back to sign-in
- [x] 3.5 Normalize and display reset errors (invalid/expired link) and provide a path to request a new reset link

## 4. Roles/Profile Post-Signup Consistency

- [x] 4.1 Verify whether a profile/roles row is created for new users; document current behavior
- [x] 4.2 If missing, add a server-authoritative mechanism to ensure profile/roles row exists (prefer DB trigger; otherwise lazy-create on first use)
- [x] 4.3 Add/adjust any RLS/policies needed for the profile/roles mechanism to work in local dev

## 5. Automated Tests (TDD)

- [x] 5.1 Add failing tests for signup happy path (session returned) and implement until passing
- [x] 5.2 Add failing tests for confirmation-required path (no session) and implement until passing
- [x] 5.3 Add failing tests for existing-email and other common error cases and implement until passing
- [x] 5.4 Add failing tests for forgot-password request (accepted + non-enumerating messaging) and implement until passing
- [x] 5.5 Add failing tests for update-password flow (valid token updates password; invalid/expired token errors) and implement until passing
- [x] 5.6 Add a regression test that profile/roles row exists (or is created) for a newly signed-up user

## 6. Manual Verification (agent-browser)

- [x] 6.1 Use agent-browser to run the signup flow end-to-end against local Supabase (new email/password)
- [x] 6.2 Use agent-browser to verify sign-in works immediately after signup (or after confirmation-required messaging)
- [x] 6.3 Use agent-browser to verify existing-email signup error UX
- [x] 6.4 Use agent-browser to request a password reset and follow the reset link to set a new password
- [x] 6.5 Use agent-browser to verify the user can sign in with the new password

## 7. Final Verification

- [x] 7.1 Run `pnpm test` and ensure auth flows tests pass
- [x] 7.2 Manually confirm logout + session state still behaves correctly after adding signup/reset
