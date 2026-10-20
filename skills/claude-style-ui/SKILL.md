---
name: claude-style-ui
description: "Build, restyle, or review local web interfaces in Claude's visual language when the user asks for Claude UI, Claude 风格, Open Claude UI, or the supplied Storybook/Figma reference. Covers layouts, themes, components, chat, restrained motion and optional advanced interaction recipes. Use for the requested visual direction, not for unrelated UI tasks or merely because a project uses a Claude API."
metadata:
  version: "2.1.0"
---

# Claude Style UI

Turn the user's chosen Claude references into working interfaces in their existing project. The user does not need to use Figma or know design terminology. Read the project and implement; use concrete rendered results to resolve visual choices.

This is a locally authored, Claude-inspired design skill. It draws on Anthropic's MCP Apps kit/documentation, the user-supplied Storybook, and reviewed code from the community Open Claude UI repository. See [sources and evidence](references/sources.md) for the coverage and limits of each source. It is not an official complete export of Claude's product UI.

## Choose the right surface

- **Standalone project (default):** apply the Claude visual language to the project's own navigation, content, and tasks. A finance dashboard remains a finance dashboard; a notes app remains a notes app. No Claude API, Figma account, or MCP connection is needed for styling.
- **Chat/assistant interface:** add the conversation, composer, attachments, and operation-status patterns when the requested product needs them.
- **Actual MCP App in Claude:** read [MCP App adaptation](references/mcp-apps.md). The host's styles and conversation constraints take precedence over standalone defaults. Do not add a second app shell inside an inline card.

For existing projects, keep the framework, navigation behavior, data flows, and established accessibility primitives. Change the requested visual scope and necessary adjacent details. Use the project's name and content. Do not turn style work into adding AI features or rewriting the application.

## Start from evidence, then implement

1. Inspect the actual screens, styles, component library, and applicable project instructions. Identify the representative screen and important states in the requested scope.
2. Read [design system](references/design-system.md). For ordinary local projects, use the **Storybook palette** unless the user or project selects another. Use one coherent palette; the official MCP palette is a distinct option, not an interchangeable bag of colors.
3. Read the relevant entries in [component and layout patterns](references/component-patterns.md). Build shared primitives where they help the actual screen, using existing components first.
4. Implement a representative screen with real project content, render it, inspect it, and correct concrete defects. If the user already authorized the complete scope, continue through it without creating an extra approval gate. When visual direction remains consequentially unclear, show the result and translate plain-language feedback into changes.
5. Verify both themes, relevant phone/desktop sizes, keyboard interaction, and content states as described below. Report what was rendered and what remains unverified.

Read [motion](references/motion.md) for transitions, streaming, status indicators or gestures. Read [advanced interactions](references/advanced-interactions.md) for scroll following, resizable document panes, command/mention suggestions, or asynchronous confirmation. Read [Open Claude UI adoption](references/open-claude-ui.md) when choosing upstream CSS or React/Tailwind examples or checking their actual contracts. For a compact desktop workbench, model-effort controls or queued-message notices, read [desktop workbench patterns](references/desktop-workbench.md); the upstream v2 report is a separate optional direction, not a replacement for the default Storybook appearance. These are optional routes; a simple card restyle does not need the advanced helpers or the entire reference set.

## Visual identity that should survive adaptation

- Warm, layered neutral surfaces; clear dark and light themes; terracotta as a controlled accent.
- A quiet application shell and a strong content hierarchy. Use an editorial serif sparingly for a welcome or major heading, readable sans for UI, and mono for code/data. Chinese must remain readable with local fallbacks.
- Fine borders, restrained shadows, generous but purposeful spacing. Avoid decorating every section as a floating card.
- Compact desktop controls with usable phone hit areas. The Storybook's 24–40 px visual controls do not override 44 px touch targets.
- Soft 20 px composers, flatter document-like assistant responses, and restrained transient feedback where those patterns fit the product.
- Visible, honest states: loading, empty, validation, error, retry, disabled, selected, hover, focus, and active. Do not invent thinking duration, upload success, saved status, or copied success.

Avoid treating a cream background and orange buttons alone as sufficient fidelity. Also check text width, density, sidebar proportions, alignment, control sizes, surface contrast, and state behavior. Preserve a project's strong existing identity when the user requested only a local Claude-style element.

## Reusable assets

- [claude-theme.css](assets/claude-theme.css): semantic tokens, Storybook/official palette options, explicit or system light/dark theme, fonts and motion constants.
- [claude-components.css](assets/claude-components.css): scoped examples for shell, buttons, cards, form fields, conversation, composer, attachments, tables, and status.
- [preview.html](assets/preview.html): interactive, offline visual reference. It is a demonstration, not a connected AI product or a finished application template.
- [claude-interactions.js](assets/claude-interactions.js): optional, explicitly mounted scroll-follow and split-pane helpers. Each instance has `destroy()`; adopting the appearance alone never requires this script.
- [interaction-preview.html](assets/interaction-preview.html) and [interaction-preview.css](assets/interaction-preview.css): offline experiments for those two helpers, with clearly simulated streaming and narrow-screen pane adaptation.

Adapt only the assets the project needs. Tokens and classes are scoped beneath `data-claude-ui`; set `data-claude-palette="storybook"` and `data-claude-theme="system"`, `"light"`, or `"dark"` on that same root. Keep the CSS token prefix `--clui-` or map it deliberately into existing project tokens. Load theme CSS before component CSS. Preserve the project's CSP, bundler, and theme persistence conventions; do not add CDN React, Babel, Tailwind, remote fonts, or an animation library just to reproduce the reference.

Component classes belong on descendants of the theme root, for example `<div data-claude-ui data-claude-palette="storybook" data-claude-theme="system"><section class="clui-card">…</section></div>`. The local assets separate decorative `--clui-border` from stronger `--clui-control-border` outlines; retain that distinction when mapping tokens.

The preview shows how assets fit together. Its local demo handlers are not production persistence, authentication, uploads, or model streaming. Implement those behaviors through the target project's existing services only when requested.

Use upstream Open Claude UI as a source of reviewed recipes, not as an unconditional dependency. The reviewed snapshot now emits JavaScript/declarations and exposes CSS subpaths, but its root barrel still includes an Electron host module. CSS imports need no React runtime; the full stylesheet also includes global selectors and motion, so inspect and scope it before adoption. Keep the target project's existing libraries, accessible primitives and design-token namespace; select and adapt only what the actual feature needs. Community constants and reverse-engineering claims do not override host tokens or current project behavior.

## Verify the actual result

Check the changed screen at a narrow phone size around 390 px and a desktop size around 1280–1440 px. Include 320 px when the view must fit small devices. Inspect actual rendered screenshots, not just classes or passing builds.

- Light/dark: all surfaces, borders, input placeholders, code, selected controls, focus, and disabled states remain legible. Normal text aims for 4.5:1 contrast; large text and meaningful boundaries for 3:1. Terracotta with white small text needs checking; use dark text or a darker action fill when necessary.
- Layout: no page-wide horizontal overflow; long Chinese/English strings, filenames, numbers, URLs, and realistic table rows fit. Code/table regions may scroll horizontally on purpose. Composer, keyboard-safe layout, and drawers must not cover essential actions.
- Input: Tab and Shift+Tab reach controls in a sensible order; focus is visible; Escape closes appropriate overlays and returns focus. Mobile controls have at least 44 × 44 px effective targets. Do not submit Enter while an IME is composing; preserve a multiline input convention.
- States: real callbacks drive success/failure; retry keeps the user's input; pending state does not strand a control; clipboard denial does not show success. Demo/synthetic results stay clearly identified.
- Motion: reduced motion removes spatial/repeating effects without hiding content or disabling controls. No perpetual decorative animation on an idle screen.
- Optional advanced interactions: manually scroll away during updates and confirm that reading position remains stable; jump back and confirm following resumes. Test a split-pane by keyboard, cancellation, resize to an infeasible width, and unmount. See the advanced reference for specific checks instead of assuming an upstream example is complete.
- Scope: an unrelated screen or outside DOM root retains its existing styles. A local restyle does not force a site-wide theme migration.

Use the project's relevant checks, plus targeted interaction checks for any behavior changed. Do not introduce a new test framework just to check colors. Browser emulation does not establish physical phone, Safari, virtual keyboard, or assistive-technology acceptance; name those gaps if they matter.

## Example requests

- `使用 $claude-style-ui，把这个项目的首页和设置页做成 Claude 的风格，保留现有功能。`
- `Use $claude-style-ui to build a warm, readable bilingual dashboard with light and dark themes.`
- `使用 $claude-style-ui，只调整这个输入框和附件区域，并检查手机上是否好用。`
- `Use $claude-style-ui to review this screen against the supplied references and fix the evidenced gaps.`
