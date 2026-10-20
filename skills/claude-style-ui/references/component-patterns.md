# Component and layout patterns

This guide combines observed Storybook components with pragmatic standalone patterns. Sidebar, dashboard, settings, drawer, form, and table behavior below are adaptations, not assertions that the Figma kit contains those screens.

## Application shell and navigation

Use a warm quiet sidebar, a simple header, and a dominant main content area. Separate primary navigation from recent items and account/settings. Selected navigation should change surface and weight, not rely on accent text alone. Keep list actions visually restrained but reachable on focus/touch. Long titles truncate with an accessible full name.

Use links for navigation and buttons for actions. A collapsing desktop sidebar retains an understandable expand control. On mobile, an overlay drawer needs a labelled open/close control, Escape/back behavior, focus containment, focus return, and background inaccessibility. Reuse the project's established accessible dialog/drawer primitive. Do not implement a pointer-only animated panel.

## Conversation and messages

User messages can be right-aligned, softly filled rounded bubbles. Assistant responses read like a document on the main canvas, with a clear text hierarchy, comfortable width, lists, tables, and code where needed. Avoid wrapping every assistant paragraph in a decorative card or adding redundant avatars to every line.

Keep action rows stable: copy/retry/edit affordances must not reflow text. Hover actions must also appear on keyboard focus and remain available on touch. New output should not forcibly scroll someone away from text they are reading; show a way to return to new content.

For a streaming product, use the [scroll-follow contract and optional helper](advanced-interactions.md#stream-without-taking-the-readers-place); do not add streaming merely to achieve this appearance.

Status represents real operations: preparing, retrieving, processing, or generating. A collapsible status panel may summarize observable steps; it should not invent private model reasoning or pretend an artificial timer measures server work. Use concise live-region announcements, not a character-by-character screen-reader feed.

## Composer and attachments

Observed reference: soft 20 px outer radius, 14 px-ish padding, textarea above a compact action row, subtle inset outline/shadow that strengthens on focus, send action at the lower right. Use a visible field label or accessible name; a placeholder alone is insufficient.

Keep draft text during retries. Autosize actual input up to a sensible height; then scroll inside the field rather than growing indefinitely. Enter can submit and Shift+Enter add a line for chat, provided composition is complete; normal forms/notes keep their established behavior. Check `isComposing` (and framework/browser equivalents as appropriate) before submission. Disabled send means empty/invalid/pending according to product rules, with a clear stop/cancel action only if the service supports it.

Attachment tiles should show file type, readable/truncated filename, actual upload state, and a labelled remove action. Keep clear focus targets. Do not present a sample tile as an uploaded file; connect actual progress, error, cancellation, and retry if real upload is in scope.

If commands or mentions are requested, read [advanced composer guidance](advanced-interactions.md#commands-and-mentions-in-a-composer) for caret-aware replacement, suggestion semantics and asynchronous draft ownership.

For compact workbench toolbars, model-effort controls or queued-message notices, read [desktop workbench patterns](desktop-workbench.md). Use backend capabilities and real persistence/receipts; the upstream toolbar is a display example.

## Buttons, inputs, and selections

- Primary: one clear main action per task; neutral strong or readable terracotta treatment, depending on the selected palette and project.
- Secondary: thin border and low elevation. Ghost: quiet until hover/focus. Icon-only: accessible action name, visible focus, usable hit area.
- Inputs: associated label, readable placeholder, clear focus/error, error text near the field. Avoid increasing page contrast by drawing heavy black boxes around every field.
- Select/menus: keep the project's accessible primitives. MCP inline surfaces have different constraints; see the MCP reference instead of banning all menus in standalone products.
- Segmented control: softly filled full-radius track and raised selected pill. Pick semantics according to purpose: tabs require tablist/tab/tabpanel relationships and keyboard navigation; a setting choice can use native radios. Do not assign tab semantics to generic navigation.
- Checkboxes/switches: native semantics with clear text labels and an explicit checked state. Do not let CSS-only color changes be the only state cue.

Compact desktop controls can be 28–32 px visually; touch targets expand to at least 44 px. Keep button labels from wrapping awkwardly while allowing the group to reflow.

## Cards, lists, dashboard and settings

Use one sentence or heading to orient each card. Surface difference plus a fine border is usually enough. Reserve terracotta for useful emphasis. Make card-wide navigation accessible without nested interactive links fighting buttons. Avoid applying a hover lift to noninteractive cards.

For a dashboard, foreground the important numbers, align comparable values, and use a quieter secondary metadata line. For settings, group labelled fields, explain consequences next to a control, and use the product's actual save/persistence model. A Claude style should not introduce unnecessary confirmation steps.

Tables use readable row height, subtle separators, numeric alignment, clear sort state, and horizontally scrollable regions on narrow views when preserving comparison is necessary. Provide a labelled region; do not make the whole page scroll sideways. Lists can switch to stacked rows when comparison is unimportant.

## Code, documents and detail panels

Code gets a quiet container, a small language/filename header, a real copy control, readable mono type, and local horizontal scrolling. Copy reports success only after clipboard write succeeds; catch denial, retain a useful recovery, and reset transient status. Do not erase code after copying or use a toast as the only accessible feedback.

For document/artifact panes, distinguish the content toolbar from the app navigation. Maintain a clear close/return affordance and preserve the user's place. On phones, favor a full-width view over an impossibly compressed two-column split. Previews should be labelled when they are samples.

Use [resizable pane guidance](advanced-interactions.md#resizable-document-panes) only when resizing is useful. A static detail page needs no drag handler or additional JavaScript.

## Dialogs and feedback

Use an existing accessible modal/dialog implementation, with a clear title, intentional initial focus, Escape where appropriate, and focus return. Native HTML dialog is a reasonable simple-project option. Do not use a custom translucent overlay just to get the appearance.

Empty states tell the user what belongs here and offer the relevant first action. Loading skeletons should resemble the coming content. Errors preserve input and give a concrete recovery. Success feedback is brief, truthful, and does not shift surrounding layout. Keep repeated background retries quiet unless user action is required.

## Check the hard content cases

Render a long Chinese title, long English identifier, mixed script filename, empty list, disabled control, pending task, recoverable error, and enough rows to scroll. Check both themes at desktop and phone widths. A component that only looks right with a two-word English label is incomplete.
