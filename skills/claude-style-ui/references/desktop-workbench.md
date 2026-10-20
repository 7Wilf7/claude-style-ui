# Optional compact desktop workbench

Read when the requested screen is a compact agent/developer workbench, an effort selector or composer retry area. Source: [Open Claude UI `docs/v2` at `4045ce7`](https://github.com/Caho1/open-claude-ui/tree/4045ce76afdcb7dccef1b7e6417b04c4c6046e9c/docs/v2), reviewed 2026-10-20. Its report targets a claimed desktop `v2.37337.1`; that is the report's version boundary, not independently verified current Claude behavior. Styling a dashboard does not require adding agents, model controls, queues, native windows or execution environments.

## Select density deliberately

The report proposes a flatter workbench: canvas `#fcfcfb` light / `#151515` dark, less rounded input, and compact/comfortable density. Keep the default warm Storybook treatment unless the user's reference or actual task calls for the workbench. The upstream distributed CSS still uses a 20 px composer; `data-density` alone does not apply the report's recipe to the bundled skill assets.

Nominal values from `docs/v2/03-架构重构与对比分析.md:81–110`:

| Role | Compact | Comfortable |
| --- | --- | --- |
| Composer radius | 12 px | 14 px |
| Control radius | 6 px | 8 px |
| Control height | 24 px | 32 px |
| Nested control height | 18 px | 22 px |
| Icon size | 16 px | 20 px |

Those are nominal labels: the report's code uses rem values multiplied by `--cds-rem-scale`; current CSS defines it as `16 / 17`. Actual pixels depend on root font size. For web reuse, choose explicit project values rather than globally shrinking root text to emulate a desktop package. Map needed roles to `--clui-radius-composer`, `--clui-radius-md`, `--clui-control-*` or existing project tokens and implement density selectors locally. Keep reading text legible and effective touch targets at least 44 × 44 px. Compact visual rows must not create overlapping invisible hit areas or clipped focus rings.

The report separates canvas, message bubbles, composer editor, action row and notices. Use that separation to keep layout stable: the editor owns draft/selection, the toolbar owns supported actions/settings, and notices summarize actual operations. A retry banner should not replace or clear the draft. On narrow panes, wrap or collapse secondary labels while retaining accessible names; move detailed model/context information to a separate surface when useful.

## Effort selection is capability-driven

`code-examples/ModelSelectorEffort.tsx` shows a controlled `currentEffort` / `onEffortChange` choice and a config with allowed levels/recommendation. Use the selected model/backend's actual supported options. Five levels and the sample English descriptions are examples, not universal model facts. The declared `modes` and `disallowThinkingDisabled` fields do not implement their behavior in that component; do not render unsupported controls or promise a performance/cost result.

Prefer native radios/select or the project's accessible popover/radio-group primitive. Label the current selection, expose expanded/selected state, support keyboard navigation, Escape and focus return, and fit the panel to narrow containers. Configuration is not active execution: a static setting needs no perpetual pulsing status dot. Apply/confirm feedback should reflect actual persistence when persistence is in scope.

## Queued-message notices need real ownership

`ChatComposerChin.tsx` accepts only `failedQueueCount` and `onRetryQueue` for its queue display. The component itself implements no IndexedDB/localStorage, replay, deduplication, retry state or delivery guarantee. Its Attach/Send buttons are visual placeholders. The richer queue described in `docs/v2/02` is a design proposal in this source, not a working service provided by importing the toolbar.

For a requested queue feature, use the project's real controller. Keep message identity, owner/conversation scope, draft plus attachments, delivery status and receipt aligned; retries must follow the service's idempotency/cancellation rules. Display “saved locally” only after the actual write succeeds, and “sent” only on a real receipt. Show pending/error/retry states without duplicate submission; retain recovery if storage or network fails. Do not add durable storage or automatic replay merely for a visual restyle.

Only expose Attach/Send if they work through the actual editor/upload/service contract; otherwise omit them or clearly label a preview as a simulation. See [advanced composer and confirmation contracts](advanced-interactions.md) for draft ownership, IME and truthful callbacks.

## Modern CSS and motion are optional enhancements

The report describes `sibling-index()`, View Transitions, wave/lockstep skeletons and variable-font axes. Feature-detect the exact API used and retain immediately visible, functional static content when unsupported or reduced motion is enabled. A system fallback font will not acquire proprietary `ANIM` / `ANM2` axes from a CSS attribute.

`CdsMotionEngine.tsx` is a demo: its pill uses `scale-125` (1.25) despite a 1.32 label, and some animation utility/keyframe names require additional CSS configuration. Do not copy the label as a measured spring result. Prefer existing motion primitives and small, interruptible transitions; don't mount an engine just for toolbar styling. See [motion](motion.md) and [CSS import boundaries](open-claude-ui.md#package-and-css-boundaries).

## Focused acceptance

Render the selected density with real long Chinese/English labels in both themes at desktop and narrow pane widths. Check readable text, focus rings, target separation, wrapping and no overflow. For effort controls verify unsupported options are absent and selection/keyboard/dismissal work. For actual retry features verify rejected storage, offline/send failure, pending retries and acknowledged delivery preserve the right draft and never show unearned success. For CSS enhancements check the fallback and reduced-motion path; report real-device/Safari/assistive-technology gaps separately.
