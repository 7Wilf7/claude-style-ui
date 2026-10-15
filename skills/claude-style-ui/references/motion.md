# Motion for Claude-style interfaces

Motion supports focus, state, and spatial continuity. Use static UI for most repeated reading and data work. The values below were recorded from the user-selected Storybook and compared with the pinned Open Claude UI source; they are community reference values, not independently verified constants from Claude's production source.

## Reference timing

| Duration | Reference use | Local decision |
| --- | --- | --- |
| `60ms` | small feedback/color | Immediate pointer response; do not animate every property |
| `120ms` | segmented selection | Small contained state changes |
| `200ms` | ordinary transition/accordion | Default starting point |
| `300ms` | drawer/detail pane | Larger spatial change, if useful |
| `450ms` | large visual transition | Uncommon; avoid delaying frequent actions |

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

The inspected source includes these four presets. Use them only when a project already uses a spring system or the interaction warrants one; installing Motion/Framer Motion is not part of adopting this style.

| Source preset | Stiffness | Damping | Mass |
| --- | --- | --- | --- |
| Small button | `600` | `30` | `1` |
| Card/popover | `320` | `28` | `1` |
| Bouncy feedback | `380` | `18` | `1` |
| Panel/drag | `1200` | `80` | `0.1` |

At Open Claude UI commit `2834bc1`, the actual TS export names are respectively `SPRING_BOUNCY`, `SPRING_SNAPPY`, `SPRING_GENTLE`, and `SPRING_HEAVY_SNAP`. Its AGENTS/manuals give different numbers and swap the apparent roles of the first three names. Use the implementation's numeric contract when adapting that file; do not combine a documentation name with a different row's parameters. The existing table remains the numeric reference for this skill, not a mandate to install Framer Motion.

The page's advertised settling/overshoot labels were not independently measured. Do not repeat those figures as guarantees, or mix physical spring parameters with duration/bounce parameterizations and claim they are equivalent.

Direct manipulation such as a split handle should track the pointer immediately; animate a deliberate reset or panel transition only if it improves orientation. A 4 px drag threshold or 150 ms scroll cooldown is a starting point from a particular example, not a universal timing law. See [advanced interactions](advanced-interactions.md) for the cancel/resize/keyboard behavior that matters more than matching a spring constant.

## Reduced motion and performance

Under `prefers-reduced-motion: reduce`, remove translation/scale/bounce, repeated dots/shimmer, and glyph blur. Keep content visible and controls functional; represent pending state with stable text. Do not rely on a late animation-end event to unlock essential UI.

Check real interaction, cancellation, rapid repeated activation, reduced motion, and scrolling during updates. Keep touch scrolling owned by the appropriate surface. Claim physical-device or Safari performance only when actually tested.
