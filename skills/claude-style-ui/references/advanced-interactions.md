# Optional advanced interactions

Use this only when the requested product needs streaming conversation, a resizable reading/work pane, suggestions or an async confirmation. Adopting Claude's visual language alone requires none of these behaviors.

## Stream without taking the reader's place

Represent two intentions: **following latest** and **reading history**. Appending content should follow only when the user was following before the update. Do not decide this solely from distance measured after adding a tall block; a short, previously fitted conversation can become scrollable on its first update.

- A real upward wheel/drag/touch or reading navigation can pause following. Typing into a composer, moving a caret, selecting text or pressing a button is not automatically scroll intent.
- Keep the visible reading position stable during continued updates while paused. Show an explicit return-to-latest action when useful; activating it restores following.
- Check late content height changes, such as loaded images or wrapping text. Preserve the same intention through viewport resize.
- The reviewed source uses roughly 40 px bottom tolerance and 150 ms user-input protection. They are configurable starting points. Schedule any deferred follow that is still valid after the cooldown; do not leave the instance stuck until a future token happens to arrive.
- Avoid a single boolean that discards the next `scroll`: a no-op programmatic scroll may never emit that event, so it would instead discard the user's next real scroll. Continuous smooth-scroll events also do not fit that model.
- Limit announcements to meaningful status/new-content summaries. Do not feed every streamed grapheme into an assertive live region. Keep the user able to stop a real operation through the target service's existing cancellation mechanism.

## Optional local scroll helper

Load [claude-interactions.js](../assets/claude-interactions.js) only for the feature that needs it. It exposes one `window.ClaudeStyleUI` namespace and does not mount itself. The [interaction preview](../assets/interaction-preview.html) shows the required markup and explicit lifecycle.

`attachScrollFollow({ viewport, content, jumpButton, cooldownMs = 150, bottomThreshold = 40 })` returns `jumpToLatest()`, `refresh()` and `destroy()`. Pass the actual vertically scrolling viewport, its content element, and an accessible native button. Initial mounting follows only if the viewport is already within the bottom threshold; it preserves an existing history-reading position. After pausing, the explicit return action resumes following. Call `refresh()` after an app-controlled update if needed; automatic size observation is only a convenience. Do not bind this helper to an inline MCP card whose host owns vertical scrolling.

Keep model/network fetching outside the helper. Demo streaming is synthetic and must remain labelled. Destroy the instance when its view unmounts so observers, listeners, timers and frames do not outlive the feature. Reuse the project's existing scrolling implementation instead when it already meets this contract.

## Resizable document panes

The goal is space for reading and work, not a universal two-column application. Use a labelled, keyboard-operable separator when both panes fit. Use a stacked or switchable view when their minimum widths cannot fit in the actual container.

- Calculate minima from available content width after the handle/gaps. Detect infeasible bounds before clamping; a ratio outside `[0,1]` is not a responsive solution.
- A small pointer dead zone prevents a click from becoming a drag. After activation, track the pointer directly rather than putting a delayed width animation behind it.
- Keep the captured handle mounted through the gesture. `pointerup`, `pointercancel`, lost capture, Escape, resize and unmount need explicit cleanup. Cancellation restores all changed layout state, not only a numeric ratio.
- Provide ArrowLeft/ArrowRight, meaningful Home/End limits and a reset-to-balanced action. Update separator orientation, controls and value/min/max information. Preserve visible focus and keep the handle out of the tab sequence when resizing is unavailable.
- Narrow mode preserves both panes' content. Do not silently discard or hide the document; move focus to a meaningful visible element if its handle is removed from interaction.
- Pointer capture alone is not a tested promise about embedded iframe crossings. If the target has iframes, test the real integration; any temporary hit-test layer must actually intercept pointers and be removed on every ending path. An overlay with `pointer-events:none` is not a shield.

`attachSplitPane({ root, leftPane, rightPane, separator, resetButton?, initialRatio = 0.5, minLeft = 280, minRight = 280 })` returns `reset()`, `refresh()` and `destroy()`. Use the `.clui-split`, `.clui-split-pane` and `.clui-split-separator` structure in [interaction-preview.css](../assets/interaction-preview.css). The helper deliberately omits automatic pane collapse and arbitrary iframe messaging. For an established project, preserve its split-pane library if it already supplies these guarantees.

The sample helper's generated `aria-valuetext` uses English. Localize that announcement alongside the separator label when adapting it for a Chinese or other locale-specific production interface, and verify the result with the target assistive technology.

## Commands and mentions in a composer

Add `/` or `@` only when the product has actual commands or attachable references. Track the trigger's start, the caret and the selected replacement range. Choosing a suggestion must replace that range while preserving the suffix and restoring the caret.

Choose one complete accessible suggestion model: keep focus in the editor with valid active-descendant/listbox relationships, or use an appropriate existing editor primitive. Provide labelled input, open/closed state, result count/empty result, clear selection and dismissal. Enter/Tab acceptance and Escape must respect IME composition; Shift+Tab retains backward navigation. Candidate confirmation in a Chinese input method must not submit, accept an unrelated suggestion or close the whole dialog.

An async submit owns a draft lifecycle: keep or snapshot the draft and attachments, prevent accidental duplicate submission, and preserve/recover input on failure. A callback starting a promise is not the successful result. A token estimate should be clearly approximate unless it uses the target model's actual tokenizer; never present a character-count multiplier as measured model usage.

## Confirmation, tools and preview boundaries

Use a real dialog primitive or native dialog with a labelled title/description, appropriate initial focus, background isolation, keyboard containment and focus return. Choose what happens on pending/error/success explicitly: an operation may close optimistically only when the product has a credible recovery path. A general confirmation example should not clear context merely because a callback was invoked.

For actual tool actions, display states from the real controller/receipt: awaiting authorization when required, running, success, failure or cancellation. Keep the concrete prepared action visible. Never make a decorative permission button a source of backend authority or show timer-driven success as execution proof. Retain a useful retry/cancel action only when the service supports it; the UI style does not authorize retries of non-idempotent operations.

For an actual artifact/iframe integration, keep source-window/origin checks, message validation, a constrained capability set and the host's real authorization. A past click (`hasBeenActive`) is not consent for a later iframe message. This visual skill provides no generic privileged bridge.

## Focused verification

For scroll following, test bottom append; scroll up during continued updates; return and resume; fitted-to-overflow content; image/viewport growth; a no-op return followed by real user scroll; and destruction with a pending cooldown. For split panes, test pointer drag, below-threshold movement, Arrow/Home/End/reset, Escape rollback, cancellation/lost capture, too-narrow resize, focus recovery and unmount. Repeat the relevant cases with reduced motion and both themes.

Real input methods, physical touch, screen readers and iframe integration still need their own acceptance when applicable. Synthetic composition events and a plain local preview do not prove those environments.
