# Motion for Claude-style interfaces

Motion supports focus, state, and spatial continuity. Use static UI for most repeated reading and data work. The values below were recorded from the user-selected Storybook and compared with the pinned Open Claude UI source; they are community reference values, not independently verified constants from Claude's production source.

## Reference timing

| Duration | Current upstream CSS token | Local decision |
| --- | --- | --- |
| `60ms` | `--cds-dur-fast` | Immediate press/color response; do not animate every property |
| `120ms` | `--cds-dur-snap` | Small contained selection changes |
| `200ms` | `--cds-dur-base` | Ordinary transition/accordion starting point |
| `300ms` | `--cds-dur-sheet` | Larger panel movement, if useful |
| `450ms` | `--cds-dur-slow` | Optional press release/large transition; avoid delaying frequent actions |

These durations also match the earlier Storybook reference. At upstream `c1f923a`, the five tokens are finally defined in `cds-theme.css`. The `.cds-btn-squish` recipe needs both `--cds-dur-fast` and `--cds-dur-slow`, plus `--cds-btn-spring`: copying the easing alone leaves its transition invalid. Map the whole dependency chain into project tokens and inspect the computed transition. Its sampled CSS `linear(...)` spring is different from constant-speed `linear`; feature-detect that function and provide a supported ease-out fallback when needed. Reduced motion still removes spatial press/release effects.

Reference curves:

- Soft deceleration: `cubic-bezier(.165,.84,.44,1)`.
- Snap: `cubic-bezier(.32,.72,0,1)`.
- Slight overshoot: `cubic-bezier(.34,1.3,.64,1)`; optional feedback only, not a universal easing.

Use `opacity`, `transform`, and deliberately chosen layout transitions. Avoid `transition: all`, animated page-wide blur, or simultaneous bounces throughout a screen. Keep interruption smooth and settle to a meaningful state. A drawer that closes mid-entry should reverse from its current position instead of restarting an unrelated animation.

## Streaming text and status

The reference shows a roughly 90 ms blur/opacity reveal and a 30 ms stagger. Treat this as optional visual texture. Default to immediate readable text for long responses; avoid replaying previous chunks, wrapping entire transcripts in a span per codepoint, or exposing each glyph as an accessibility announcement.

If a product explicitly needs grapheme reveal, segment by user-perceived grapheme (`Intl.Segmenter` where available), preserve emoji/combining characters, animate only newly received content, cap active spans, and clean up timers on cancellation/unmount. Do not make content wait behind a decorative typewriter loop when server text is already available.

The reference's three thinking dots use about 1.9 seconds per cycle, staggered by 150 ms, with a 2.5 px vertical movement. Only run a status indicator while a real task is pending. A reduced-motion version can show static dots plus a textual status. A demo must say that its operation is simulated.

An accordion can use intrinsic-size/grid-row transitions when available, with an inner `min-height: 0` wrapper. Fully collapsed contents must leave the tab sequence and accessibility reading order. A native `details` without height animation is often sufficient.

## Optional spring references

The inspected source includes these four named exports. Use them only when a project already uses a spring system or the interaction warrants one; installing Motion/Framer Motion is not part of adopting this style. The latest comments report client **2.42304.2** call sites, distinct from the historical v1/v2 manuals. This skill reviewed the community files, not that proprietary client bundle.

| Actual export | Stiffness | Damping | Mass | Current upstream provenance/use |
| --- | --- | --- | --- | --- |
| `SPRING_BOUNCY` | `600` | `30` | `1` | Reported mic/voice-bar mount, width/padding and icon changes |
| `SPRING_SNAPPY` | `320` | `28` | `1` | Reported drag-release rebound with release velocity |
| `SPRING_GENTLE` | `380` | `18` | `1` | Community project's own bouncy preset; no claimed client call site |
| `SPRING_HEAVY_SNAP` | `1200` | `80` | `0.1` | Reported file-viewer width open/close |

At Open Claude UI commit `c1f923a`, the numbers are unchanged, but the source corrects the earlier generic button/card/sidebar labels. In particular, do not describe `380/18` as extracted Claude physics, or `320/28` as a verified client popover entrance. The same file's `motionPopover` and `motionMessageFadeUp` still reuse `SPRING_SNAPPY`; those are example choices, not independent evidence of official call sites. Its newer report lists additional inline spring configurations without exporting them as presets; the four names are not a complete client inventory.

The page's advertised settling/overshoot labels were not independently measured. Do not repeat those figures as guarantees. A `duration: .32, bounce: .15` spring is not an equivalent spelling of `380/18`; retain the selected engine's parameterization rather than swapping between them based on a prose label.

Direct manipulation such as a split handle should track the pointer immediately; animate a deliberate reset or panel transition only if it improves orientation. A 4 px drag threshold or 150 ms scroll cooldown is a starting point from a particular example, not a universal timing law. See [advanced interactions](advanced-interactions.md) for the cancel/resize/keyboard behavior that matters more than matching a spring constant.

## Reduced motion and performance

Under `prefers-reduced-motion: reduce`, remove translation/scale/bounce, repeated dots/shimmer, and glyph blur. Keep content visible and controls functional; represent pending state with stable text. Do not rely on a late animation-end event to unlock essential UI.

Check real interaction, cancellation, rapid repeated activation, reduced motion, and scrolling during updates. Keep touch scrolling owned by the appropriate surface. Claim physical-device or Safari performance only when actually tested.
