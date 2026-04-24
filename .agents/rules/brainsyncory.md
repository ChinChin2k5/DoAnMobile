

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

- [JavaScript/TypeScript] Use === not == (strict equality prevents type coercion bugs)
- [JavaScript/TypeScript] Use const by default, let when reassignment needed, never var

## Available Tools (ON-DEMAND only)
- `sys_core_01(q)` — Deep search when stuck
- `sys_core_05(query)` — Full-text lookup
> Context above IS your context. Do NOT call sys_core_14() at startup.
