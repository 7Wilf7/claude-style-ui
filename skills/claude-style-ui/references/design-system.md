# Claude visual system

Use semantic roles, then choose one palette. The default standalone palette is derived from the user's Storybook. The optional official palette records Claude's published MCP App values. All layout sizing and combinations below are adaptations unless explicitly labelled as source values.

## Surface and color profiles

**Storybook reference values:**

| Role | Light | Dark |
| --- | --- | --- |
| Base / quiet sidebar | `#f5f5f3` | `#0b0b0a` |
| Main canvas | `#fcfcfb` | `#151515` |
| Panel / card | `#ffffff` | `#1a1a19` |
| Raised / composer | `#ffffff` | `#20201e` |
| Terracotta accent | `#d97757` | `#d97757` |
| Accent hover | `#cc5a36` | `#cc5a36` |
| Light accent tint | `#fbf3ef` | Adapt a dark tint; do not reuse this light fill |

Its grayscale reference includes `#dedcd6`, `#a4a19b`, `#6b6863`, `#373634`, and `#20201e`. Select role-based text and borders with sufficient contrast rather than distributing every swatch across the page. Decorative accent and readable action/text colors may differ.

**Official MCP App values:**

| Host role | Light | Dark |
| --- | --- | --- |
| `color-background-primary` | `#ffffff` | `#30302e` |
| `color-background-secondary` | `#f5f4ed` | `#262624` |
| `color-background-tertiary` | `#faf9f5` | `#141413` |
| `color-text-primary` | `#141413` | `#faf9f5` |
| `color-text-secondary` | `#3d3d3a` | `#c2c0b6` |
| `color-text-tertiary` | `#73726c` | `#9c9a92` |
| `color-border-primary` | `#1f1e1d` at 40% | `#dedcd1` at 40% |
| `color-border-secondary` | `#1f1e1d` at 30% | `#dedcd1` at 30% |
| `color-border-tertiary` | `#1f1e1d` at 15% | `#dedcd1` at 15% |

These names are host roles; mapping tertiary to a whole standalone canvas is a local layout decision. For a real MCP App, use the live host variables instead of assuming that this snapshot is current.

For an explicitly requested compact desktop workbench, consult [the optional workbench profile](desktop-workbench.md) for density and 12/14 px nominal composer radii. Those report values and the newer upstream CSS palette are separate alternatives; the bundled assets retain the Storybook/official profiles above.

Depth comes mostly from changing surfaces and borders. Raise a composer, menu, or modal with a small shadow. Keep the main page quiet; do not use the Storybook's dotted preview stage as a product background.

## Typography and bilingual content

Official MCP token sizes: body `12/14/16/20px`; headings `12/14/16/20/24/28/36px`. Body line heights are `1.4` through 16 px and `1.25` at 20 px. The guide recommends a simple heading/body/caption hierarchy. These are a small palette to choose from, not a requirement to show every size.

Standalone starting points: UI 14–16 px, reading text 16 px with 1.6–1.75 line height, secondary copy 12–14 px, primary screen heading 28–36 px. The extra reading line height is an adaptation for longer English and Chinese content.

- Sans: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`.
- Editorial serif, optional for a welcome/hero: `ui-serif, Georgia, "Songti SC", "Noto Serif CJK SC", serif`. Do not make dense Chinese UI labels serif for visual novelty.
- Mono for code and aligned data: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.
- `font-variant-numeric: tabular-nums` for updating counters and comparable table numbers.
- Keep normal CJK line breaking; use `overflow-wrap: anywhere` for URLs/identifiers. Avoid universal `word-break: break-all` or squeezed one-character columns.
- Limit headings only when a full title remains accessible. Essential descriptions and errors should wrap rather than disappear behind ellipses.

The Storybook's Inter/Newsreader/JetBrains Mono choices are references, not required dependencies. Do not claim system fallbacks are pixel-identical to Anthropic fonts.

## Radius, spacing, controls

| Family | Recorded values | Use |
| --- | --- | --- |
| Official radius | `4/6/8/10/12px`, full `9999px` | MCP component scale |
| Storybook visual radius | approximately `5/6/8/10/14px`, composer `20px`, full `999px` | Standalone reference scale |
| Reviewed Open Claude UI shape roles | dialog `16px`, user message `18px`, composer `20px` | Optional named roles; community source values, not official host tokens |
| Storybook visual heights | `24/28/32/40px`; titlebar approximately `46–48px` | Compact desktop controls |
| Touch target | at least `44 × 44px` | Official mobile guidance; adapt the visual control or its hit area |
| Local spacing scale | `4/8/12/16/20/24/32/48px` | Practical consistent spacing, not an extracted official scale |

The official border-width token is `0.5px`. The local `--clui-hairline` is `1px` at 1x, `0.5px` at 2x and `1/3px` at 3x, following the reviewed community material recipe. It is used only for decorative card/code inset rings, avoiding fractional border-width rounding. Meaningful control outlines stay 1 px with `--clui-control-border`, and focus stays explicit; a subtle hairline is not a substitute for an identifiable input.

Use 8 px control corners, 10–14 px cards, 18 px user bubbles, and 20 px composers where the selected profile calls for them. `--clui-radius-dialog` provides a separate 16 px starting point for a real dialog primitive. A large container does not need a larger radius at every nesting level. Keep spacing relationships consistent: icon/label gap < control padding < related-section gap < screen-section gap.

## Layout starting points (adaptations)

- Desktop sidebar: about 248–280 px, quieter than the main content. Clear selected item; simple header/footer groups. Let it collapse if useful.
- Reading/chat column: about 42–48 rem maximum, fluid below that. Use 16–24 px horizontal room on phones; keep long line lengths in check.
- Data/dashboard content: may expand to 64–76 rem with responsive grids. Do not force all data into a chat-width column.
- Optional artifact/detail pane: show only when requested. At narrow widths, switch to a distinct view/sheet, retaining a clear return path.
- Small screens: turn the sidebar into an accessible drawer or navigation surface; do not preserve a fixed 256 px sidebar beside a 390 px viewport.
- Use `100dvh` when a full-height shell is needed, safe-area padding for fixed bottom controls, and `min-width: 0` on flexible content children. Avoid hiding page overflow to conceal a sizing defect.

## State and contrast choices

Use the terracotta accent selectively: current task, active indicator, main action or a small status flourish. Do not color all links, badges, headers, borders, and icons orange.

Verify accent text and button labels against their actual background. White 14 px text on the Storybook's raw `#d97757` fill may fail normal-text contrast; choose a dark label or a darker action fill while retaining the accent swatch. Borders and focus rings need visible contrast in both themes, including raised dark surfaces.

Shadows may strengthen on focus, but a keyboard focus indicator must remain explicit. Hover is optional feedback; state, affordance, and core actions must remain available to keyboard and touch users.
