## 1. Workspace Scaffold

- [ ] 1.1 Add pnpm workspace configuration and root package.json scripts
- [ ] 1.2 Add Turborepo configuration for dev/build/test/lint tasks
- [ ] 1.3 Create apps/ and packages/ directory layout per manifesto

## 2. Shared Tooling Baselines

- [ ] 2.1 Add base TypeScript configuration at repo root
- [ ] 2.2 Add eslint and prettier configuration at repo root
- [ ] 2.3 Wire apps/packages to extend shared configs

## 3. App Shells

- [ ] 3.1 Scaffold web app shell and basic landing page
- [ ] 3.2 Scaffold API app shell with health endpoint
- [ ] 3.3 Add shared package (types/utils) and verify workspace imports

## 4. Local Supabase Development

- [ ] 4.1 Add Docker Compose configuration for local Supabase services
- [ ] 4.2 Add env templates and defaults for local Supabase connectivity
- [ ] 4.3 Document local Supabase startup and usage steps

## 5. Verification

- [ ] 5.1 Verify web app starts in dev mode
- [ ] 5.2 Verify API health endpoint responds locally
- [ ] 5.3 Verify Supabase stack starts and is reachable
