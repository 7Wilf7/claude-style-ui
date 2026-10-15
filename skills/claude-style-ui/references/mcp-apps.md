# When the target really is an MCP App

Read this only for UI rendered inside a compatible Claude conversation. Applying Claude-style CSS to a normal local app does not require MCP. This design skill does not itself implement a connector, server authorization, publication, or deployment.

Use the current [official design guide](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines) and [developer quickstart](https://claude.com/docs/connectors/building/mcp-apps/quickstart) when writing actual integration code. SDK names and transport examples can change independently of this visual reference.

## Host styles win

Receive and apply the host's theme/style context through the current SDK-supported mechanism. Map semantic `--clui-` tokens to supplied `--color-background-*`, `--color-text-*`, and related host variables; do not freeze the Storybook palette inside the host. Keep backgrounds transparent where the integration requires it and update when the host theme changes. See [official transparent theming](https://claude.com/docs/connectors/building/mcp-apps/transparent-theming). The host's font provisioning does not imply that a standalone site can redistribute those font files.

Host context can include safe-area insets, container size, and supported modes. Respect those actual values instead of treating a single device breakpoint as sufficient. Mobile hosts may render through native WebViews and have different capabilities from the web version; use current capability information rather than assuming browser APIs are available.

## Choose the smallest useful display mode

| Mode | Official guidance snapshot | Resulting design choice |
| --- | --- | --- |
| Inline card | Focused summary; roughly 4–5 data points, no more than 2 bottom actions | Complete one small task without app-shell navigation or nested vertical scrolling |
| Inline carousel | About 3–8 comparable items, consistent cards, at most one CTA each | Show next-card peeking and usable horizontal swipe; preserve host scroll |
| Fullscreen | Analysis, document work, or complex content | Provide an explicit expand affordance; keep essential controls clear of the host composer/navigation |

Inline height should fit actual content. On mobile, the conversation owns vertical pan gestures. If the task needs an independent long scrolling viewport, request a supported larger mode rather than trapping the user in a small nested scroller.

## Divide interaction ownership

Direct changes to shown data—selection, filtering, slider/toggle changes, expansion, confirmation—can stay in the app. Language requests, refinement, clarification, or a change of topic belong in the host conversation. Avoid embedding a competing chat composer in an MCP card.

Prefer visible segmented controls and inline options over clipped popovers in constrained containers. This constraint is not a ban on accessible menus in a standalone project.

When a real tool action needs confirmation or status, render the controller's actual awaiting-approval, running, success, error or cancellation state. The community tool-card example uses a local success timer; keep that behaviour clearly simulated in a preview. A UI permission button does not establish backend authority. See [advanced tool and preview boundaries](advanced-interactions.md#confirmation-tools-and-preview-boundaries) when implementing this feature.

Declare only external resource/connection origins that the actual implementation needs through the current resource metadata and CSP mechanism. Do not copy arbitrary CDN scripts from the Storybook. Test the actual host, not just the HTML opened in a browser; local standalone rendering does not establish a working MCP connection.
