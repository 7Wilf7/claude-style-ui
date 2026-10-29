# Selected community interface patterns

Read only for the requested feature. Reviewed 2026-10-29 (Asia/Shanghai); this is independently written behavioral synthesis, not bundled source code or acceptance of the authors' fidelity claims. The default Storybook profile and official MCP host integration remain unchanged.

## Evidence map

| Source and fixed revision | Role / license at that revision | Inspected implementation |
| --- | --- | --- |
| [imsai-sh/open-claude-design](https://github.com/imsai-sh/open-claude-design/tree/19b48b1096f97c96cc21f58b1af9c411da65b46f) | Community reconstruction of `claude.ai/design`; pre-alpha, Apache-2.0 | `packages/design-tokens/src/index.ts`; `apps/web/src/features/chat/ChatMsg.tsx`, `Composer.tsx`; `apps/web/src/routes/Workspace.tsx` |
| [Damienchakma/Open-claude](https://github.com/Damienchakma/Open-claude/tree/9f37bbb8c8819e01481f5615f963d35da52d6cbf) | Claude-inspired chat implementation; MIT | `src/index.css`; `src/components/ThinkingDisplay.jsx`, `ArtifactPanel.jsx` |
| [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui/tree/c17c2f6d5f7e1e1d47fe37144ce0b2030002e331) | CloudCLI agent workbench; adjacent interaction reference, **not a Claude appearance specification**; AGPL-3.0-or-later with additional terms noted in README | `src/modules/chat/transcript/LazyMessageRow.tsx`; `hooks/useChatComposerState.ts`, `hooks/useChatSessionState.ts` under `src/modules/chat/` |

The files were inspected statically. No new source applications, dependencies, model calls or native hosts were run. Links pin the evidence; paths are relative to each repository. Consult the actual license and notices before copying implementation. No code or assets from these projects are included in this skill.

## Quiet conversation hierarchy and grouped tools

Open Claude Design's `ChatMsg.tsx:68–155` uses a small filled user block, comparatively plain assistant text and a compact mono frame; `flushTools` at `383–387` groups consecutive tools. The useful lesson is less repeated chrome, not its exact 13.5 px text or 12 px bubble radius. The source targets a design workbench; it does not establish the geometry of classic Claude chat.

When the requested assistant interface shows many operations, group contiguous routine activity with a clear summary and expandable details. Keep a pending decision, actionable failure or cancellation visible at the level where the user needs to act; do not bury it in a collapsed successful group. Let real controller state determine count, progress and outcome. Preserve the user's expansion choice and expose the disclosure with the project's accessible primitive.

`ThinkingDisplay.jsx:16–73` in Open-claude illustrates automatic opening during incoming content, bottom-aware following and distinct character/token metrics. It does **not** automatically collapse when streaming ends; implement any completion-compaction policy deliberately, preserving an explicit open choice and focus. Do not invent reasoning content or model measurements. Its component returns before later hooks on an empty state and uses a fixed panel id, so importing it unchanged is not a verified React/accessibility solution. Keep existing [scroll and disclosure contracts](advanced-interactions.md) authoritative.

## Artifact views should preserve the user's work

Open-claude's `ArtifactPanel.jsx:85–224` separates Preview from Source and adapts a desktop side pane to an overlay on narrow screens. Open Claude Design's `Workspace.tsx:116–123,316–364` keeps the preview mounted while hiding it with `display:none` when another view is selected. That avoids rebuilding the same iframe and losing in-preview state on a simple tab change.

For a requested artifact feature, model artifact identity/version separately from its selected view. Switching Preview/Source for the same trusted instance should retain useful preview state, source selection, unsaved edits and a return path. An explicit artifact revision or reset may deliberately rebuild it. Remove inactive views from keyboard/accessibility navigation; restore focus to a meaningful visible control. Keeping a frame mounted does not mean approving background timers, audio, network traffic or later privileged actions. Pause or dispose those resources according to the feature's lifecycle, and destroy the instance on project/account change.

Keep the target project's iframe isolation and validated host messaging. The source's permissive sandbox and CDN runtime are not a recipe for this skill. The Open-claude copy handler also marks success without awaiting clipboard acceptance. Use actual promise results and preserve useful failure feedback. A visual preview change neither saves nor publishes the artifact.

## Multiline input and draft ownership

Open Claude Design's `Composer.tsx:1–8` documents a multiline-first shortcut: Enter inserts a newline, Cmd/Ctrl+Enter sends. This is an optional convention for prompt/design editors, not a new default for existing chat products. Preserve the product's chosen convention and show a compact hint when needed. Every submit shortcut still respects IME composition. Local attachment previews should appear promptly, while upload/pending/error state and removability remain explicit; a thumbnail is not an uploaded-file receipt.

CloudCLI's `useChatComposerState.ts:272–282` keys a draft to the selected session, using the project only before a session exists. Its queued operations retain the originating session separately from the currently displayed composer. For requested multi-conversation input, keep editor state and pending async work tied to stable conversation identity. On switching A→B, a late upload/send failure for A must not insert content into B, clear B's draft or attach A's queued card there. Preserve A's recoverable input under A's identity. Account/project/provider dimensions belong in that identity when the target system requires them; do not assume the source's session id is globally unique in a different product. Styling alone never enables durable storage or replay.

## Long history without scroll jumps

CloudCLI's `LazyMessageRow.tsx:46–83` keeps a wrapper for each loaded row and replaces expensive offscreen content with its last measured height. `useChatSessionState.ts:117–130` captures a visible message and its viewport offset before history changes. These are useful implementation observations, not a required virtualization library or measured performance guarantee.

Preserve stable message identity and the visible reading anchor whenever older content is prepended. If long history is actually slow, consider mounting fewer expensive rows while retaining that geometry. Distinguish loading fewer history records, mounting fewer subtrees, and skipping offscreen layout/paint; none alone proves full-list virtualization. Test zero-height and fractional-height rows, late images, theme/font/width changes, search jumps and the target browser. Preserve selection, in-page find and assistive-technology access when unmounting content; prefer the existing project's list primitive if it already solves the problem. Do not add lazy mounting to a short conversation just to copy this source.

## Sources screened out of this skill's baseline

`apexscaleai/claude-ui-design-system` and `ceorkm/claude-design-system` are generic design workflows powered by Claude, not evidence of Claude's own visual language. `VoltAgent/awesome-claude-design` is useful for discovery, not implementation evidence. `13point5/open-artifacts` is an archived historical reference; its age is not current-fidelity evidence. `chihebnabil/claude-ui` has conflicting README/license labels at the reviewed snapshot, so do not assume its reuse terms. `sahaj-b/claudeAI-frontend-clone` lacks a reviewed license. AionUi is an adjacent multi-agent product; its tokens do not define Claude colors. Reassess these only if a later revision supplies a concrete, relevant improvement.
