# Contributing

## Workflow

1. Start from an up-to-date `main` branch.
2. Create a focused branch such as `codex/inventory-alerts`.
3. Keep each pull request limited to one roadmap outcome.
4. Run `npm test` before opening the pull request.
5. Document new data fields, external events, configuration, and failure modes.

## Commit convention

Use short Conventional Commit messages:

- `feat: add inventory risk filter`
- `fix: preserve product drawer focus`
- `docs: describe square pos adapter`
- `test: cover product detail rendering`

## Definition of done

- The user-facing state is truthful and handles empty/loading/error cases.
- Keyboard and small-screen use are supported.
- Motion respects `prefers-reduced-motion`.
- No credential or personal data is committed.
- Tests and production build pass.
- Relevant documentation is updated.
