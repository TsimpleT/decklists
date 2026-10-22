# Copilot instructions

## Project at a glance

Decklists is a client-side site for browsing Riftbound card data, archetypes, decklists, and tournament results, plus managing personal decklists. It is published under `/decklists/` on GitHub Pages. The app is TypeScript with React 19, React Router 7, and Create React App (`react-scripts` 5.0.1); styles are CSS Modules. Data-preparation utilities are Python scripts.

There is no `.nvmrc`, `engines` declaration, or standalone lint script. Use Node 20+ because React Router 7 requires it (and the testing-library dependencies require Node 18+); Python 3.9+ is needed by the RC-qual script. Node 24.20.0/npm 11.19.0, React Router 7.18.4, and Python 3.10.6 were validated locally.

## Layout and conventions

- `src/AppMainRouter.tsx` defines routes; `src/Routes.ts` is the source of route patterns, path builders, and the `/decklists` basename; `src/index.tsx` mounts the app. `BrowserRouter` owns route state. Read route params/location through `withRoute` when a class component needs router hooks; don't parse `window.location` or duplicate the deployment prefix.
- `src/Pages/` contains route-level screens; `src/Views/` contains reusable UI; component styles and barrel `index.ts` files are colocated.
- `src/Data/` contains domain logic and tournament/decklist data. `src/Data/Cards/` contains card models, lookup logic, and JSON card sets/mappings. Add or adjust focused tests alongside this logic (`*.test.ts`).
- `src/Assets/` holds images. `public/` holds static site assets.
- `python_scripts/` contains interactive CSV-to-JSON card/mapping tools, category generation, and `rc-quals/rc_quals.py`, which combines the event CSVs into a results CSV. The card-category generator consumes the generated card JSON. These tools write data files; inspect their inputs and intended output before running them.
- Root configuration: `package.json`/`package-lock.json` (scripts and dependencies), `tsconfig.json` (strict TypeScript), and `.gitignore`. ESLint settings are embedded in `package.json`; CRA performs checks during build. `package.json` contains the Jest module mapping needed for React Router 7 under CRA/Jest 27; the active CRA setup file is `src/setupTests.ts` (the standalone `jest.config.ts` is not used by `react-scripts test`). `README.md` is empty. See `docs/CONVENTIONS.md` for naming/import/commit conventions, `docs/TODO.md` for known work, and `docs/RELEASE-NOTES.md` / `docs/UPDATE-HISTORY.md` for release history.
- Preserve the existing class-based component style. The small `src/withRoute.tsx` function-component adapter is the established exception for exposing router hooks to class pages. Use PascalCase for files (except Python); keep component CSS in CSS Modules and follow the import ordering in `docs/CONVENTIONS.md`. Card `id`, `baseId`, and `ttsId` have distinct meanings—see that document.

## Build, test, and run

On a fresh checkout, always install from the lockfile first. `package-lock.json` is lockfile version 2; it must include optional platform dependencies such as `fsevents` for modern npm to accept it. The lockfile is synchronized with `package.json`. This sequence was validated on Node 24.20.0/npm 11.19.0: clean install succeeded, all 6 Jest suites / 35 tests passed, and the production build succeeded:

```sh
npm ci
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

The GitHub Actions workflow at `.github/workflows/ci.yml` runs these same install, test, and build checks on Ubuntu/Node 24 for pull requests and pushes to `main`. The clean install took about 44 seconds locally and reported dependency deprecation/audit warnings, plus npm's install-script approval notice for `core-js` and `core-js-pure`; tests and build still succeeded. Do not run broad dependency fixes as part of an unrelated task. The build emits a Node 24 `fs.F_OK` dependency deprecation warning but succeeds; the Browserslist database has been refreshed. `npm run build` creates `build/` for the `/decklists/` homepage path.

To develop, run `CI=true npm start`. The `start` script runs tests before starting the dev server; CI mode makes that preflight noninteractive. The server was verified at `http://localhost:3000/decklists/` (HTTP 200). In PowerShell, set the environment first with `$env:CI='true'`. On this Windows setup, PowerShell blocks the `npm.ps1` shim under its current execution policy; use `npm.cmd`/`npx.cmd` rather than changing that policy.

There is no separate lint command. `npm test` without `--watchAll=false` normally enters Jest watch mode. **Do not use `npm run predeploy` as a one-shot check:** it invokes `react-scripts test --watchAll`, which remained in watch mode after all tests passed and did not reach the build within 120 seconds, even with `CI=true`. Run the explicit test and build commands above instead. `npm run deploy` publishes to GitHub Pages; do not run it unless deployment is explicitly requested. `npm run eject` is a one-way CRA operation and should not be used.

Python syntax validation passed with Python 3.10.6:

```sh
python -m py_compile python_scripts/base_card_list_to_json.py python_scripts/generate_card_categories.py python_scripts/id_mappings_to_json.py python_scripts/rc-quals/rc_quals.py python_scripts/script_helpers.py
```

No separate Python dependency manifest or automated Python test suite is present. The data-generation scripts are input-dependent and were not run, to avoid overwriting checked-in data.

Trust these repository-specific instructions and use the paths and commands above; search the repository only if a detail is missing or these instructions prove incorrect.
