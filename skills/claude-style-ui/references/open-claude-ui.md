# Selecting Open Claude UI recipes

Use this reference when a requested feature benefits from the user's new source repository. Reviewed snapshot: [Caho1/open-claude-ui at `2834bc158a4849f21c97cbb2e0b10525f6e646f1`](https://github.com/Caho1/open-claude-ui/tree/2834bc158a4849f21c97cbb2e0b10525f6e646f1), inspected 2026-10-15. The repository is a community reconstruction. This skill keeps a small, tested local adaptation instead of vendoring the entire library.

## Pick by task

Paths in the table are relative to that pinned repository. Inspect the relevant current file before importing it; the notes below describe this snapshot, not all later releases.

| Need in the target project | Upstream starting points | Integration decision |
| --- | --- | --- |
| Material and component geometry | `code-examples/cds-theme.css`, `CdsButton.tsx`, `AttachmentCard.tsx` | Map semantic roles into existing tokens. Keep this skill's readable action/control colors and touch targets. |
| Motion constants | `code-examples/ClaudeMotionPresets.ts` | Read actual exported numbers, not the conflicting guide table; use an existing motion library only if the feature needs it. |
| Streaming conversation | `code-examples/useClaudeScrollPinning.ts`, `ChatMessageBubbles.tsx` | Adopt follow/paused states and an explicit return control. Use the local optional scroll helper or existing project behavior after testing; do not swallow the next scroll event with a stale flag. |
| Rich composer | `code-examples/RichComposerWithMentions.tsx` | Useful concept for caret-aware commands/mentions. Repair suggestion semantics, selection-range replacement, Shift+Tab and asynchronous draft ownership if adapting it. |
| Document/artifact split | `code-examples/ArtifactsSplitPaneResizer.tsx` | Prefer the project's accessible split primitive or the local optional helper. Verify keyboard/cancel/minimum-width behavior; the source's claims exceed its handlers. |
| Local toolbar compression | `code-examples/ContainerResponsiveBar.tsx`, `useClaudeRovingFocus.ts` | Container queries can respond to an actual pane width. Preserve accessible names, focus and active state when hiding labels; do not copy a fixed breakpoint ladder as a device taxonomy. |
| Confirmations and tool status | `code-examples/ConfirmationDialog.tsx`, `McpToolDecisionCard.tsx` | Keep a real modal primitive and actual backend callbacks. A demo timer cannot establish that an action succeeded or was authorized. |
| Media/details | `code-examples/MediaLightboxViewer.tsx`, `StreamingDiffViewer.tsx`, `CodeBlock.tsx` | Read only if the product needs them. Test focus/keyboard, copy denial, long lines and incremental updates; retain the source content exactly when copying code. |
| Native desktop integration | `code-examples/createClaudeMainWindow.ts`, `ClaudeDesktopHeader.tsx` | Only for an existing Electron/native-host project; never part of styling an ordinary website. |

## Actual package shape

The inspected `package.json` points both `main` and `types` at `src/index.ts`. Its barrel exports all 30 TS/TSX examples, including the Electron window factory. React/React DOM, Framer Motion and Lucide are peers; TypeScript and Electron also occur in development dependencies. The TS configuration uses `noEmit: true`, so a successful `build` script is not evidence of a compiled browser distribution.

Treat it as inspectable source, not a verified drop-in npm library. Do not install the repo or its complete dependency set into a user's app merely to get the appearance. In a compatible React/Tailwind project, select the necessary files and map their classes/tokens into the existing build. In a plain HTML, Vue, Svelte or other project, adapt the behavior without introducing React. No upstream build or full component-runtime validation was performed during this skill update.

## Resolve documentation conflicts by evidence

The actual `cds-theme.css` has these source-role mappings:

| Upstream source role | Existing skill role | Light / dark snapshot |
| --- | --- | --- |
| `--cds-surface-0` | `--clui-base` | `#f5f5f3` / `#0b0b0a` |
| `--cds-surface-1` | `--clui-canvas` | `#fcfcfb` / `#151515` |
| `--cds-surface-2` | `--clui-panel` | `#ffffff` / `#1a1a19` |
| `--cds-surface-3` | `--clui-raised` | `#ffffff` / `#20201e` |

These happen to agree with the previously selected Storybook palette. The repo's AGENTS/manual use a different `--cds-bg-surface-*` palette. Do not merge those into a third accidental theme. Official MCP host variables remain a separate source and win inside a real Claude host.

Source radii include 16 px dialogs, 18 px user bubbles, 20 px composers and 999 px pills. The bundled local token scale now names dialog/message/composer roles instead of assuming every large surface shares one radius. Exact radius remains a design choice in the target project's requested scope.

The useful material idea is **one quiet decorative outline per grouped surface**. This does not mean removing visible input boundaries or keyboard focus rings. Decorative separators can use a high-density hairline; necessary controls retain the measured `--clui-control-border` contrast and normal focus treatment. Do not globally force variable-font weights such as `465` on system/CJK fonts without verifying the actual font and readability.

## Gaps to check before copying a component

These are source-level observations at the pinned SHA. They explain why the local skill does not blindly import the examples; they are not claims about subsequent upstream fixes.

- `CodeBlock.tsx:31–36` marks copied immediately after starting a clipboard promise. Await the real write, handle rejection, and clear/reset the timer; this skill's basic preview already does so.
- `ArtifactsSplitPaneResizer.tsx:86–99, 118–123, 153–161` can hide the captured handle during a drag, clamps inconsistent minima in a narrow container, restores only part of the cancel state, and exposes focus without arrow-key adjustment. Its `pointer-events-none` overlay at 198 does not intercept iframe pointers. The local helper avoids automatic pane collapse and makes no untested iframe-crossing guarantee.
- `RichComposerWithMentions.tsx:114–152` detects a trigger before the caret but replaces a match at the end of the whole draft. At 178, Shift+Tab also accepts a suggestion. At 205–225 it clears the draft regardless of an optional asynchronous consumer. Use a complete editor contract, not just its rendered menu.
- `ConfirmationDialog.tsx` supplies dialog-looking markup but lacks a complete focus/background lifecycle and calls close immediately after `onConfirm`. Reuse a real dialog primitive and choose the async success/error behavior explicitly.
- `McpToolDecisionCard.tsx` advances a local timer to success. This is demo state, not a tool receipt. A permission card's UI never grants authority by itself.
- The iframe bridge's parent `hasBeenActive` fallback is a historical gesture signal, not authorization for a current privileged message. The rate-limit example jitters server wait hints; a visual skill must not redefine a service's retry, cancellation or idempotency policy.

Prefer existing stable project behavior when it already solves these cases. The upgrade's [advanced interaction contracts](advanced-interactions.md) are the reusable requirements; the upstream files are optional implementation reading.

## Attribution

Source author: **Caho1**, copyright 2026, [MIT license](licenses/open-claude-ui-MIT.txt). Retain that notice if copying a substantial upstream implementation. Local helpers and previews are independently written adaptations of the reviewed interaction ideas; this record does not establish Anthropic endorsement or rights to unrelated proprietary assets.
