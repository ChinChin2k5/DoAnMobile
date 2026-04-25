

# Project Memory — DoAnMobile
> 880 notes | Score threshold: >40

## Safety — Never Run Destructive Commands

> Dangerous commands are actively monitored.
> Critical/high risk commands trigger error notifications in real-time.

- **NEVER** run `rm -rf`, `del /s`, `rmdir`, `format`, or any command that deletes files/directories without EXPLICIT user approval.
- **NEVER** run `DROP TABLE`, `DELETE FROM`, `TRUNCATE`, or any destructive database operation.
- **NEVER** run `git push --force`, `git reset --hard`, or any command that rewrites history.
- **NEVER** run `npm publish`, `docker rm`, `terraform destroy`, or any irreversible deployment/infrastructure command.
- **NEVER** pipe remote scripts to shell (`curl | bash`, `wget | sh`).
- **ALWAYS** ask the user before running commands that modify system state, install packages, or make network requests.
- When in doubt, **show the command first** and wait for approval.

**Stack:** JavaScript · React · DB: Firebase

## 📝 NOTE: 1 uncommitted file(s) in working tree.\n\n## Important Warnings

- **⚠️ GOTCHA: Fixed null crash in Reset — prevents null/undefined runtime crashes** — -   useEffect(() => {
+ useEffect(() => {
- 
+   const loadUserData
- **⚠️ GOTCHA: Fixed null crash in Reset — prevents null/undefined runtime crashes** — -       setTimeout(async () => {
+           // Reset AsyncStorage để
- **gotcha in Dashboard_Thi_Sinh.js** — -   // 🔴 BƯỚC 3: THÊM DÒNG NÀY ĐỂ MƯỢN BIẾN TỪ KHO CHỨA CHUNG
+   //
- **⚠️ GOTCHA: Optimized GOTCHA** — - - ⚠️ GOTCHA: Optimized GOTCHA
+ - ⚠️ GOTCHA: Optimized Score — paral
- **⚠️ GOTCHA: Optimized Score — parallelizes async operations for speed** — - > 868 notes | Score threshold: >40
+ > 872 notes | Score threshold: 
- **⚠️ GOTCHA: Optimized GOTCHA** — - - ⚠️ GOTCHA: Optimized GOTCHA
+ - ⚠️ GOTCHA: Optimized Score — paral

## Active: `Screens_Duy`

- **⚠️ GOTCHA: Fixed null crash in Reset — prevents null/undefined runtime crashes**
- **⚠️ GOTCHA: Fixed null crash in Reset — prevents null/undefined runtime crashes**
- **gotcha in Dashboard_Thi_Sinh.js**
- **🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (61 changes, 5min) — confirmed 3x**
- **what-changed in Dashboard_Thi_Sinh.js — confirmed 14x**

## Project Standards

- 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (61 changes, 5min) — confirmed 3x
- what-changed in Dashboard_Thi_Sinh.js — confirmed 14x
- what-changed in Dashboard_Thi_Sinh.js — confirmed 81x
- what-changed in Dashboard_Thi_Sinh.js — confirmed 11x
- Fixed null crash in Async — prevents null/undefined runtime crashes — confirmed 6x
- what-changed in Dashboard_Thi_Sinh.js — confirmed 5x
- what-changed in Dashboard_Thi_Sinh.js — confirmed 10x
- convention in Tao_De_Thi_Part2.js

## Known Fixes

- ❌ - - Fixed null crash in Async — prevents null/undefined runtime crashes → ✅ problem-fix in agent-rules.md
- ❌ - - Fixed null crash in View — prevents null/undefined runtime crashes → ✅ problem-fix in agent-rules.md
- ❌ -           console.error('Failed to load user data', e); → ✅ Fixed null crash in AsyncStorage — prevents null/undefined runtime crashes
- ❌ - - Fixed null crash in AsyncStorage — prevents null/undefined runtime crashes → ✅ problem-fix in agent-rules.md
- ❌ - - Fixed null crash in Ionicons — prevents null/undefined runtime crashes → ✅ problem-fix in agent-rules.md

## Recent Decisions

- decision in firebaseConfig.js
- Optimized Score — parallelizes async operations for speed
- Optimized Score — parallelizes async operations for speed
- Optimized Score — parallelizes async operations for speed

## Learned Patterns

- Always: what-changed in brainsync_auto.md — confirmed 3x (seen 2x)
- Decision: Optimized Score (seen 2x)
- Decision: Optimized Score — parallelizes async operations for speed (seen 3x)
- Agent generates new migration for every change (squash related changes)
- Agent installs packages without checking if already installed

### 📚 Core Framework Rules: [callstackincubator/react-native-best-practices]
# React Native Best Practices

## Overview

Performance optimization guide for React Native applications, covering JavaScript/React, Native (iOS/Android), and bundling optimizations. Based on Callstack's "Ultimate Guide to React Native Optimization".

## Skill Format

Each reference file follows a hybrid format for fast lookup and deep understanding:

- **Quick Pattern**: Incorrect/Correct code snippets for immediate pattern matching
- **Quick Command**: Shell commands for process/measurement skills
- **Quick Config**: Configuration snippets for setup-focused skills
- **Quick Reference**: Summary tables for conceptual skills
- **Deep Dive**: Full context with When to Use, Prerequisites, Step-by-Step, Common Pitfalls

**Impact ratings**: CRITICAL (fix immediately), HIGH (significant improvement), MEDIUM (worthwhile optimization)

## When to Apply

Reference these guidelines when:
- Debugging slow/janky UI or animations
- Investigating memory leaks (JS or native)
- Optimizing app startup time (TTI)
- Reducing bundle or app size
- Writing native modules (Turbo Modules)
- Profiling React Native performance
- Reviewing React Native code for performance

## Security Notes

- Treat shell commands in these references as local developer operations. Review them before running, prefer version-pinned tooling, and avoid piping remote scripts directly to a shell.
- Treat third-party libraries and plugins as dependencies that still require normal supply-chain controls: pin versions, verify provenance, and update through your standard review process.
- Treat Re.Pack code splitting as first-party artifact delivery only. Remote chunks must come from trusted HTTPS origins you control and be pinned to the current app release.

## Priority-Ordered Guidelines

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | FPS & Re-renders | CRITICAL | `js-*` |
| 2 | Bundle Size | CRITICAL | `bundle-*` |
| 3 | TTI Optimization | HIGH | `native-*`, `bundle-*` |
| 4 | Native Performance | HIGH | `native-*` |
| 5 | Memory Management | MEDIUM-HIGH | `js-*`, `native-*` |
| 6 | Animations | MEDIUM | `js-*` |

## Quick Reference

### Optimization Workflow

Follow this cycle for any performance issue: **Measure → Optimize → Re-measure → Validate**

1. **Measure**: Capture baseline metrics (FPS, TTI, bundle size) before changes
2. **Optimize**: Apply the targeted fix from the relevant reference
3. **Re-measure**: Run the same measurement to get updated metrics
...
(truncated)


### 📚 Core Framework Rules: [callstackincubator/upgrading-react-native]
# Upgrading React Native

## Overview

Covers the full React Native upgrade workflow: template diffs via Upgrade Helper, dependency updates, Expo SDK steps, and common pitfalls.

## Typical Upgrade Sequence

1. **Route**: Choose the right upgrade path via [upgrading-react-native.md][upgrading-react-native]
2. **Diff**: Fetch the canonical template diff using Upgrade Helper via [upgrade-helper-core.md][upgrade-helper-core]
3. **Dependencies**: Assess and update third-party packages via [upgrading-dependencies.md][upgrading-dependencies]
4. **React**: Align React version if upgraded via [react.md][react]
5. **Expo** (if applicable): Apply Expo SDK layer via [expo-sdk-upgrade.md][expo-sdk-upgrade]
6. **Verify**: Run post-upgrade checks via [upgrade-verification.md][upgrade-verification]



## When to Apply

Reference these guidelines when:
- Moving a React Native app to a newer version
- Reconciling native config changes from Upgrade Helper
- Validating release notes for breaking changes

## Quick Reference

| File | Description |
|------|-------------|
| [upgrading-react-native.md][upgrading-react-native] | Router: choose the right upgrade path |
| [upgrade-helper-core.md][upgrade-helper-core] | Core Upgrade Helper workflow and reliability gates |
| [upgrading-dependencies.md][upgrading-dependencies] | Dependency compatibility checks and migration planning |
| [react.md][react] | React and React 19 upgrade alignment rules |
| [expo-sdk-upgrade.md][expo-sdk-upgrade] | Expo SDK-specific upgrade layer (conditional) |
| [upgrade-verification.md][upgrade-verification] | Manual post-upgrade verification checklist |
| [monorepo-singlerepo-targeting.md][monorepo-singlerepo-targeting] | Monorepo and single-repo app targeting and command scoping |

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| Need to upgrade React Native | [upgrade-helper-core.md][upgrade-helper-core] |
| Need dependency risk triage and migration options | [upgrading-dependencies.md][upgrading-dependencies] |
| Need React/React 19 package alignment | [react.md][react] |
| Need workflow routing first | [upgrading-react-native.md][upgrading-react-native] |
| Need Expo SDK-specific steps | [expo-sdk-upgrade.md][expo-sdk-upgrade] |
| Need manual regression validation | [upgrade-verification.md][upgrade-verification] |
| Need repo/app command scoping | [monorepo-singlerepo-targeting.md][monorepo-singlerepo-targeting] |

[upgrading-react-native]: references/upgrading-react...
(truncated)


### 📚 Core Framework Rules: [vercel-labs/react-best-practices]
# Vercel React Best Practices

Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 64 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

- `async-defer-await` - Move await into branches where actually used
- `async-parallel` - Use Promise.all() for independent operations
- `async-dependencies` - Use better-all for partial dependencies
- `async-api-routes` - Start promises early, await late in API routes
- `async-suspense-boundaries` - Use Suspense to stream content

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` - Import directly, avoid barrel files
- `bundle-dynamic-imports` - Use next/dynamic for heavy components
- `bundle-defer-third-party` - Load analytics/logging after hydration
- `bundle-conditional` - Load modules only when feature is activated
- `bundle-preload` - Preload on hover/focus for perceived speed

### 3. Server-Side Performance (HIGH)

- `server-auth-actions` - Authenticate server actions like API routes
- `server-cache-react` - Use React.cache() for per-request deduplication
- `server-cache-lru` - Use LRU cache for cross-request caching
- `server-dedup-props` - Avoid duplicate serialization in RSC props
- `server-hoist-static-io` - Hoist static I/O (fonts, logos) to module level
- `server-serialization` - Minimize data passed to client components
- `server-parallel-fetching` - Restructure components to parallelize fetches
- `server-after-nonblocking` - Use after() for non-blocking operations

### 4. Client-Side Data Fetching (MEDIUM-HIGH)

- `c...
(truncated)


### 📚 Core Framework Rules: [vercel-labs/react-native-skills]
# React Native Skills

Comprehensive best practices for React Native and Expo applications. Contains
rules across multiple categories covering performance, animations, UI patterns,
and platform-specific optimizations.

## When to Apply

Reference these guidelines when:

- Building React Native or Expo apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts
- Structuring monorepo projects with native dependencies

## Rule Categories by Priority

| Priority | Category         | Impact   | Prefix               |
| -------- | ---------------- | -------- | -------------------- |
| 1        | List Performance | CRITICAL | `list-performance-`  |
| 2        | Animation        | HIGH     | `animation-`         |
| 3        | Navigation       | HIGH     | `navigation-`        |
| 4        | UI Patterns      | HIGH     | `ui-`                |
| 5        | State Management | MEDIUM   | `react-state-`       |
| 6        | Rendering        | MEDIUM   | `rendering-`         |
| 7        | Monorepo         | MEDIUM   | `monorepo-`          |
| 8        | Configuration    | LOW      | `fonts-`, `imports-` |

## Quick Reference

### 1. List Performance (CRITICAL)

- `list-performance-virtualize` - Use FlashList for large lists
- `list-performance-item-memo` - Memoize list item components
- `list-performance-callbacks` - Stabilize callback references
- `list-performance-inline-objects` - Avoid inline style objects
- `list-performance-function-references` - Extract functions outside render
- `list-performance-images` - Optimize images in lists
- `list-performance-item-expensive` - Move expensive work outside items
- `list-performance-item-types` - Use item types for heterogeneous lists

### 2. Animation (HIGH)

- `animation-gpu-properties` - Animate only transform and opacity
- `animation-derived-value` - Use useDerivedValue for computed animations
- `animation-gesture-detector-press` - Use Gesture.Tap instead of Pressable

### 3. Navigation (HIGH)

- `navigation-native-navigators` - Use native stack and native tabs over JS navigators

### 4. UI Patterns (HIGH)

- `ui-expo-image` - Use expo-image for all images
- `ui-image-gallery` - Use Galeria for image lightboxes
- `ui-pressable` - Use Pressable over TouchableOpacity
- `ui-safe-area-scroll` - Handle safe areas in ScrollViews
- `ui-scrollview-content-inset` - Use contentInset for headers
- `ui-menus` - Use native context m...
(truncated)


## Available Tools (ON-DEMAND only)
- `sys_core_01(q)` — Deep search when stuck
- `sys_core_05(query)` — Full-text lookup
> Context above IS your context. Do NOT call sys_core_14() at startup.
