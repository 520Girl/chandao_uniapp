# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the Uni App Vue 3 codebase; `main.ts` bootstraps the app and `App.vue` wires global layouts.
- `src/pages/` defines screen-level views registered by `pages.json`; keep sub-folders per feature (e.g., `pages/home`).
- Shared view logic lives in `components/`, composables in `composables/`, typed contracts in `types/`, and helpers in `utils/`.
- Assets belong in `src/assets/` (processed) and `src/static/` (copied as-is). Reference screenshots reside in `ui/` for QA reviews.
- Platform metadata (`manifest.json`, `pages.json`) must stay in sync with new entry files and icons placed under `src/static/`.

## Build, Test, and Development Commands
- `pnpm dev:h5` (or target-specific `pnpm dev:mp-weixin`, etc.) launches the Uni CLI dev server for the selected platform.
- `pnpm build:h5` / `pnpm build:mp-weixin` produces production bundles in `dist/` per target; always test the platform you touched.
- `pnpm type-check` runs `vue-tsc` without emitting files to catch TS regression early.
- `pnpm format` and `pnpm lint:format` apply or verify Prettier plus the import-sort plugin; run before every commit.

## Coding Style & Naming Conventions
- Prettier enforces 2-space indentation, semicolons, double quotes, and a 100-character wrap; never hand-format around these rules.
- Imports follow the configured order (`vue`, `@dcloudio/*`, auto imports, `@/`, relative). Group new aliases accordingly.
- Name Vue single-file components in PascalCase (`UserCard.vue`), composables as `useX`, and stores/utilities in camelCase modules.
- Keep SCSS variables in `uni.scss` and prefer Tailwind utility classes declared in `tailwind.config.js` for layout tokens.

## Testing Guidelines
- Use `@dcloudio/uni-automator` for integration flows; scaffold specs under `tests/` or `src/pages/**/__tests__` with the `.spec.ts` suffix.
- Snapshot key UI states by adding assets to `ui/` and referencing them in PRs to document visual baselines.
- Always run `pnpm type-check` plus platform builds that cover your change; aim for complete page navigation coverage when touching `pages.json`.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit style seen in history (`feat:`, `init:`, `fix:`). Keep the subject in English or bilingual if needed.
- Scope commits to a single concern, list breaking changes in the body, and reference issues as `Refs #123` when applicable.
- PRs need: a short summary, linked task/issue, screenshots or gifs stored under `ui/` for UI work, and a checklist of commands executed.

## Configuration & Environment
- Develop with Node.js >=18 and pnpm; reinstall deps via `pnpm install` after updating `package.json` or `pnpm-lock.yaml`.
- Environment tweaks go through `manifest.json` (platform capabilities) and `pages.json` (routing); validate both with `pnpm build:<target>`.
- Tailwind, PostCSS, and `postcss-rem-to-responsive-pixel` are preconfigured—extend tokens in `tailwind.config.js` and avoid editing generated CSS directly.

## Programming Language
- typescript + vue3 + uni-app + tailwindcss + postcss + 

## command line tools
- pnpm
- apply_patch

## language
- 中文
- zh-CN