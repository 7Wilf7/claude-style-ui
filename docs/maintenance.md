# Maintaining Claude Style UI

Maintain a coherent, useful design skill rather than a mirror of every Claude-related repository. Review the installed skill, the current default branch and the latest published version before editing. This guide describes the work; publication and scheduling still require the owner's authorization.

## Source selection

- Start with the source pins and limits in `skills/claude-style-ui/references/sources.md`. Check relevant official design guidance and Caho1/open-claude-ui, then search GitHub for additional Claude interface reconstructions and component implementations.
- Inspect the actual README, license and relevant CSS/component files at a fixed commit. Stars, screenshots and claims of reverse engineering are discovery signals, not validation. Deduplicate forks and shared upstream code before treating sources as independent evidence.
- Distinguish **Claude visual references**, **adjacent chat/workbench interaction references**, and **generic tools powered by Claude**. Only the first category can support Claude appearance claims. The second may support explicitly labelled behavioral adaptations. Exclude the third unless a concrete task calls for it.
- Record what was inspected, the source revision, exact paths, the useful decision it changes and its limits. Keep documentation claims, observed code, rendered behavior and historical evidence distinct. A source being newer does not by itself make its palette more appropriate.
- Prefer concise, independently written synthesis. Do not copy proprietary fonts, logos, binaries or undocumented assets. Inspect licensing before substantial code reuse and preserve applicable notices; use behavioral analysis rather than transplanting code when reuse terms are unclear or incompatible with the intended distribution.

## Decide whether a change belongs

Preserve the default Storybook profile, separate official MCP host semantics, existing scoped tokens, framework independence and truthful operation states. Resolve conflicting observations against the actual selected source and target product; do not average incompatible palettes or turn a community comment into an official constant.

Add material only when it improves a realistic Claude-style task: a better primitive, a demonstrated interaction correction, a useful layout option, or a meaningful clarification of source contracts. Put conditional detail in a linked reference. Avoid full copied manuals, repetitive rules, speculative features and source lists with no actionable lesson. UI styling alone does not justify adding a backend, persistence, account access or an animation dependency.

No source changes, or new commits with no useful lesson, means **no version bump, empty commit or Release**. Keep an inexpensive local check receipt instead. A correction normally increments the patch version; a substantial new supported pattern increments the minor version. Preserve existing public asset contracts; prepare a reviewable candidate if a proposed change would require breaking them or changing the chosen visual direction.

## Prepare and verify

Use an isolated checkout or worktree from current `origin/main`. Preserve dirty checkouts and concurrent work. Compare the installed skill with its known published baseline before replacing files; do not overwrite unknown local customization. Back up the exact installation before any write and compare again immediately before replacement.

Read `skill-creator` and validate the final skill with its current validator. Check relative references, source pins, license attribution, accidental local paths/credentials, README version/download links and the actual file inventory. For important new behavior guidance, independently exercise a realistic request using the skill instead of only checking prose.

If CSS/JS/HTML assets change, render the relevant desktop/phone, light/dark and reduced-motion states, inspect the result and verify the affected interactions. Documentation-only source synthesis needs accurate code evidence and forward-testing; do not report new runtime, real-device, Safari, screen-reader or service acceptance unless it actually occurred. Install dependencies only when needed for a concrete check, in the review workspace, with lifecycle scripts disabled where appropriate.

## Synchronize and publish when authorized

Synchronize with current main and resolve relevant changes before committing. Copy the validated skill to the installation and read every final file back. Confirm the repository's skill subtree, installed files and packaged files match; preserve a usable backup on failure.

Create a ZIP containing only `claude-style-ui/` and its skill files, plus a separate SHA-256 checksum. Keep maintenance receipts, absolute machine paths, caches, dependency trees and unrelated repository material outside the ZIP. Update the README and release notes to describe the actual change and verification limits.

Use a fresh, unused version/tag. Do not force-push, move a published tag or overwrite an existing Release asset. A release may be staged as a draft, checked for the intended commit and attachment digests, and then published as stable/latest. Verify remote main and the tag's peeled commit, the public release state, and a fresh unauthenticated download whose contents and checksum match the installation. Distinguish local update, pushed source, published release and verified public download if any step fails.

## Scheduled operation

The owner's chosen cadence is Sunday 10:30, Asia/Shanghai, in the existing maintenance chat. The saved automation configuration owns the actual schedule; its prompt records the authorized publication scope. Reuse the chat instead of creating one per check.

This dedicated task owns source synthesis and installation for `claude-style-ui`. General tool maintenance may inspect it but must not concurrently replace it. Immediately before writing or publishing, recheck the installed bytes and remote revision. Keep prior recoverable work if another task changed either.

Record small per-run receipts outside the skill with searched sources, inspected revisions, adopted/rejected findings, real checks and any resulting version/commit/release. Retain a current baseline and the backup needed for recovery; do not create large permanent source mirrors or expand cleanup into unrelated files. A scheduled run needs the machine and desktop app available for local work; setup is not evidence that a future natural run has completed.
