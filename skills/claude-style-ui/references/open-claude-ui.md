# Selecting Open Claude UI recipes

Reviewed snapshot: [Caho1/open-claude-ui at `c1f923ae0051a871941b98a0e2e3183a545e6a85`](https://github.com/Caho1/open-claude-ui/tree/c1f923ae0051a871941b98a0e2e3183a545e6a85), inspected 2026-10-29 (Asia/Shanghai). This update reviews the complete delta since `4045ce7`: CSS token closure and scroll selectors, spring provenance, segmented-control timing and documentation/branding. Unchanged component observations below carry forward from the earlier review and were checked against that diff. This is a community reconstruction; its claims about official production internals were not independently verified. Paths below are relative to that pinned repository. Inspect the relevant current file before adopting a later revision.

## Pick by task

| Need | Upstream starting points | Integration decision |
| --- | --- | --- |
| Framework-free appearance | `code-examples/cds-theme.css`, `cds-pure.css` | CSS subpaths work without React/Tailwind. Map selected roles into scoped project tokens; see the import boundary below. |
| Material and geometry | `CdsButton.tsx`, `AttachmentCard.tsx`, theme CSS | Retain readable action/control colors and usable touch targets. |
| Motion | `ClaudeMotionPresets.ts`, theme CSS | Use actual exports and version-scoped provenance; `SPRING_GENTLE` is project-local. Retain complete duration/easing dependencies and reduced motion. |
| CSS-only scroll fades | theme CSS `.scroll-fade-y` / `.scroll-fade-x` | Give the actual viewport bounded dimensions and overflow. The old data attribute alone no longer activates a mask. |
| Conversation and follow | `useClaudeScrollPinning.ts`, `ChatMessageBubbles.tsx` | Adopt follow/paused states and an explicit return control. Test no-op scroll, image growth, manual scroll and teardown. |
| Rich composer | `RichComposerWithMentions.tsx`, `ChatComposer.tsx` | Repair suggestion semantics, caret-range replacement, Shift+Tab and async draft ownership. |
| Artifact split | `ArtifactsSplitPaneResizer.tsx` | Prefer an accessible project primitive or the local helper; verify keyboard, cancel, iframe and narrow-width behavior. |
| Toolbar compression | `ContainerResponsiveBar.tsx`, `useClaudeRovingFocus.ts` | Respond to actual container width; retain labels, focus and active state when collapsing content. |
| Confirmations/tool status | `ConfirmationDialog.tsx`, `McpToolDecisionCard.tsx` | Use real modal primitives and controller receipts. A local success timer is a demo. |
| Compact workbench / effort / retry notices | `docs/v2/`, `ModelSelectorEffort.tsx`, `ChatComposerChin.tsx`, `CdsMotionEngine.tsx` | Read [workbench patterns](desktop-workbench.md). The report, CSS and examples are not a synchronized v2 implementation. |
| Media/details | `MediaLightboxViewer.tsx`, `StreamingDiffViewer.tsx`, `CodeBlock.tsx` | Test focus/keyboard, copy denial, long lines and incremental updates. |
| Native desktop | `createClaudeMainWindow.ts`, `ClaudeDesktopHeader.tsx` | Only for an existing Electron/native host. Website styling does not need these modules. |

Except for the explicit `docs/` row, filenames above are in `code-examples/`.

## Package and CSS boundaries

`package.json` is still version `1.0.0` while `docs/v2/` describes a desktop release. Do not infer an npm v2 release from that directory. `main`, `module` and `types` now point to `dist/src/index.js` / `index.d.ts`; `tsconfig.build.json` overrides `noEmit: false` and emits JavaScript and declarations. The root barrel exports 33 modules, including the Electron factory. React/React DOM, Framer Motion and Lucide remain peer dependencies. A successful TypeScript build is not browser-bundler or component-runtime acceptance.

For an already installed compatible package, these are declared subpaths:

```css
/* Choose one; pure.css currently imports the same theme file. */
@import "open-claude-ui/tokens.css";
/* Alternative: @import "open-claude-ui/pure.css"; */
```

Despite the `tokens.css` name, the file includes `:root` variables, `.dark` / `[data-mode="dark"]` overrides, generic classes such as `.font-medium`, keyframes, `@property` registrations and animation utilities. It is not a scoped variables-only reset. `pure.css` adds no separate component implementation in this snapshot. Do not import both, confuse upstream `data-mode` with local `data-claude-theme`, or assume these imports honor system theme automatically.

Prefer the bundled scoped `--clui-*` assets for ordinary restyling. If the project selects upstream CSS, either review a deliberate app-wide import or extract/map only the needed rules beneath its UI root, retaining attribution for substantial copying. Keep generic selectors and named keyframes/registered properties from colliding with the project. No framework migration is needed for CSS-only reuse. For React examples, map Tailwind classes into the existing build; do not replace the project's Tailwind config wholesale or assume optional animation utilities exist.

## Current CSS contracts

Use `.scroll-fade-y` for a vertical viewport or `.scroll-fade-x` for a horizontal one, inside `@supports (animation-timeline: scroll())`. The actual scroller must supply its own `overflow:auto` and bounded height/width; these classes do not create a scrolling layout. For example, apply `class="history scroll-fade-y"` with project-owned `.history { max-block-size: 24rem; overflow: auto; }`. The former `[data-cds-scroll-fade="vertical"|"horizontal"|"both"]` CSS selectors were removed; the attribute alone now has no fade effect. `ScrollFadeContainer.tsx` still uses that attribute **with its own JS and inline mask**, so it is a different integration path.

The axis-specific classes interpolate across the full scroll range. In the inspected Chromium runtime, a default 28 px vertical fade computed to top/bottom `0/28` at the start, `14/14` halfway and `28/0` at the end; fitted content kept both at zero. Horizontal behavior matched. This differs from the earlier fixed edge-range recipe. Preserve usable unmasked scrolling when timelines are unsupported. `.scroll-fade`, `.cds-scroll-fade` and `.cds-scroll-fade-vertical` still have a separate six-animation, intersected-mask path with explicit edge ranges; do not treat the paths as identical. Adding both axis-specific classes to one element overwrites animation/mask properties rather than composing two axes. Choose the one required axis, or separately review a deliberate combined implementation.

The registered fade properties use `inherits:false`. Set custom `--cds-scroll-fade-size` and edge `*-on` flags on the actual scroller, not only on an ancestor. Retain the raw/active/on dependency chain when extracting rules. Test top/middle/end, fitted content, focus visibility, both themes and target engines. Browser/version claims in source comments are not compatibility evidence. Some effects have reduced-motion gating, but the stylesheet has no comprehensive reduce override; add a scoped policy for adopted repeating/spatial effects.

The new neutral aliases complete `--cds-bg-user-message → --cds-bg-neutral → --cds-alpha-1`, explicitly redeclared in dark mode. A browser probe computed black 5% in light and white 5% in dark, rather than a transparent message fill. `--cds-fill-accent` now resolves through role aliases to blue `#2a78d6`; it is distinct from terracotta `--brand` / `--cds-clay`. Map by semantic use rather than globally recoloring accents.

All five `--cds-dur-*` tokens are now defined. `.cds-btn-squish` computed to a `transform 0.45s linear(...)` release in the probe. Extract its press/release durations together with the sampled easing; see [motion](motion.md). The CSS-mode segmented indicator now references `--cds-dur-snap` / `--cds-ease-snap`; preserve those definitions when adapting its Tailwind utilities. That source edit is not proof of a generated Tailwind build or an accessible segmented-control implementation.

## Keep source profiles distinct

Current `cds-theme.css` values differ from this skill's older Storybook palette:

| Upstream role | Local semantic counterpart | Current upstream light / dark |
| --- | --- | --- |
| `--cds-surface-0` | `--clui-base` | `#f9f9f7` / `#0b0b0b` |
| `--cds-surface-1` | `--clui-canvas` | `#fcfcfb` / `#151515` |
| `--cds-surface-2` | `--clui-panel` | `#ffffff` / `#1a1a19` |
| `--cds-surface-3` | `--clui-raised` | `#ffffff` / `#20201f` |
| `--cds-surface-popover` | contextual raised/menu role | `#ffffff` / `#2c2c2a` |
| `--brand` / `--cds-clay` | action / decorative accent candidates | `#c6613f` / `#d97757` (same swatches in both themes) |

This table records alternatives, not changes to bundled assets. The current upstream AGENTS prose lists a dark popover `#262624` and clay `#cc6b49`, but the distributed CSS still resolves to the values in the table (`#2c2c2a`, `#d97757`). Read actual CSS/computed styles instead of assuming prose and runtime agree. Choose a coherent profile, check text/boundary contrast, and keep live MCP host tokens authoritative inside a real host. Source CSS still sets composer radius `20px`, while `docs/v2/03` proposes compact/comfortable `12/14px` nominal radii. Do not silently mix the two. Preserve one quiet decorative outline per grouped surface without weakening required control/focus outlines or globally forcing variable-font weights onto untested CJK/system fonts.

## Current source gaps

These observations are scoped to the pinned SHA; recheck them before adopting a later version.

- `CodeBlock.tsx` sets copied state before the clipboard promise resolves. Await the write, handle denial and clean up transient timers. Its line-number view also uses `trim()`; preserve leading/trailing blank lines and indentation in both display and copied code.
- `ArtifactsSplitPaneResizer.tsx` has Escape rollback now, but lacks arrow-key adjustment, can hide the captured handle during a drag, and has infeasible minima on narrow containers. Its `pointer-events-none` iframe overlay cannot intercept pointers. Test cancellation and complete state restoration in the actual layout; the local helper deliberately avoids automatic pane collapse.
- `RichComposerWithMentions.tsx` detects a trigger before the caret but replaces at the end of the whole draft; Shift+Tab accepts a suggestion; submit clears the draft without awaiting an asynchronous consumer. Its recent-composition Enter guard is not proof of real input-method behavior across engines.
- `ConfirmationDialog.tsx` now delegates confirmation directly to `onConfirm`; the previous automatic-close observation is obsolete. It still lacks a complete focus/background lifecycle and accessible title relationship. Add a real modal primitive and explicit pending/error/success behavior.
- `McpToolDecisionCard.tsx` advances a timer to success. A styled permission card is not backend authority or a tool receipt.
- `ChatComposerChin.tsx` displays a local-storage claim but contains no persistence, and its Attach/Send controls have no action callbacks. Implement the underlying workflow before using those labels.
- The iframe bridge's historical user-activation fallback is not authorization for a current privileged message. The rate-limit example does not define the target service's retry/cancellation/idempotency contract.

Use the [advanced interaction contracts](advanced-interactions.md) rather than copying these examples wholesale.

## Verification and attribution

At this SHA, dependency installation in an isolated review checkout used `npm ci --ignore-scripts --no-audit --no-fund`; no Electron postinstall/binary download was run. `npm run build`, `npm run typecheck` and `npm run check:tokens` passed. The token check covers references in upstream AGENTS only, not all CSS consumption or visual contrast. A separate local browser fixture checked the current/legacy fade selectors, vertical/horizontal start/middle/end, fitted content, light/dark message fill and computed press-release transition. No upstream browser-bundler, React component-runtime, unsupported-engine, Safari, audio or native-desktop acceptance was performed.

Source author: **Caho1**, copyright 2026, [MIT license](licenses/open-claude-ui-MIT.txt). Retain that notice when copying substantial implementation. Local helpers/previews are independently written adaptations; this review does not establish Anthropic endorsement or rights to proprietary fonts/assets.
