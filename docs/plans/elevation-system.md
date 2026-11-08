# Elevation, state, and glow: one system for the Web UI

Status: proposal v2 (2026-11-08), awaiting owner decisions. No product code changes yet.
Frames: v1 `ui/design/frames/system/elevation.design.tsx` (`system/elevation/*`); v2
`ui/design/frames/system/elevation-v2.design.tsx` (`system/elevation-v2/a-*` restrained, `b-*`
expressive). Rules and proposed tokens: `ui/design/kit/elevation/elevation.css` (v1) and
`elevation-v2.css` (v2, layered on v1).

## Background

The owner asked to sort out card shadows: some feel off, some are too heavy, some carry the wrong
meaning, and they are not consistent. A full visual overhaul was rejected before; this is a restrained,
consistent pass that keeps the chat bubbles and the overall identity.

`ui/src` uses about 45 distinct shadow values in TSX and about 10 more in component CSS:
Tailwind's `shadow-sm|md|lg|xl|2xl` (52 uses), 24 arbitrary `shadow-[…]` literals, the three card
washes (`shadow-mint-card*`, 22 uses), 33 glow tokens (`shadow-glow-*`, ~120 uses), and Model Hub's
own menu/dialog/drawer variables.

## Audit (by what the shadow is for)

| Role | Today | Problem |
| --- | --- | --- |
| Resting card, panel, input | Mostly none; but Home "Getting started", setup wizard, mobile onboarding, and platform config cards wear the mint card wash (22); IM channel cards a heavy `0 18px 40px -30px rgba(0,0,0,.8)` (5); Doctor and user list hand-written washes; every Input/Select/Textarea `shadow-sm` (`field.ts`); outline button `0 1px 2px .05` | Coloured light used as height; cards on one page differ; the "inset field" is drawn raised |
| Hover / press | No shadow change (good), except the sidebar logo glow growing on hover | — |
| Selected / active | ~22 sites signal state with a glow (`glow-xs/sm/md/lg`): sidebar nav and rail, Agents/Skills/MCP rows, agent graph node and trigger, Inbox and Logs filters, a switch that is on, shortcut recording, Apps launcher open, annotate toggle, expanded config cards; `ModeSelection` uses `shadow-md`. `SegmentedRadio` and other rows use fill + border only | A glow as state; two drawings for the same control |
| Unread / attention | Inbox unread card `glow-md-mint` (a page of unread is a page of glow); unread count badges `glow-xs-cyan` (4) | The signal fades as it multiplies; in Light it reads as a pale green haze |
| Popover, menu, hover card, tooltip | Seven values: `shadow-md` (Popover primitive), `shadow-lg` (ResponsiveMenu, tooltips), `shadow-xl` (account, language, version, backend menus), `rgba(0,0,0,.6)` ×3 (Bot menu, Bot hover card, Inbox popover), `.7` (context menu, quote toolbar), Model Hub variable. Seven fills (`bg-panel/card/popover/surface/surface-2/surface-3/background`); radii md/lg/2xl/10px | Light: .6–.7 black is a dirty smudge. Dark: Tailwind's .1 black is invisible. Context menu on `surface-3` is darker than the page in Dark and grey in Light |
| Toast | `shadow-lg` on a 10% tint | Text under it shows through |
| Dialog, sheet, drawer | Dialog primitive `shadow-xl`; bespoke dialogs `.6/.7/.75/.8/.85` black plus one violet glow; Model Hub variable; panels, image viewer, drawer `shadow-2xl`; phone bottom sheet `shadow-2xl` (casts downward, off screen); Apps drawer `.55` upward | Ten-plus values; heavy in Light; sheet shadow points the wrong way |
| Floating control | Composer upward `.5`; jump-to-latest `shadow-lg`; the phone tab bar's new-session button stacks a `.6` neon drop under the brand glow; Dock `.65`; windows `.7/.6`; switch thumb; segmented thumb | Same role, different values; a doubled glow |
| Status dot | `glow-dot-*` (19) | Dark neon colour in Light too |
| Brand and decoration | Page icon tiles, sidebar logo, eyebrow badges, Apps launcher, welcome/summary marks, onboarding halo, brand CTA, Model Hub wires | Dark neon over white reads as blur |

## Proposal

**Elevation: a shadow says only how high a surface sits.**

| Level | For | Light | Dark |
| --- | --- | --- | --- |
| 0 flat | cards, rows, panels, inputs | none | none |
| 1 raised | composer, segmented thumb, switch thumb, setup panel | `0 1px 2px ink/.06, 0 1px 3px ink/.05` | `0 1px 2px black/.45` |
| 2 floating | popover, menu, hover card, tooltip, toast, Dock, jump-to-latest, unfocused window | `0 2px 6px -2px ink/.08, 0 10px 28px -6px ink/.14` | `0 2px 6px -2px black/.5, 0 12px 32px -8px black/.6` |
| 3 overlay | dialog, search palette, drawer, image viewer, focused window | `0 4px 12px -4px ink/.10, 0 24px 56px -12px ink/.22` | `0 4px 12px -4px black/.5, 0 24px 64px -12px black/.7` |
| 3 up | a sheet rising from the bottom edge | `0 -1px 4px -2px ink/.06, 0 -12px 32px -12px ink/.16` | `0 -2px 8px -4px black/.4, 0 -16px 40px -12px black/.6` |

`ink` is `rgb(8 8 18)`, the colour `--border` already mixes from. Levels 2 and 3 share one surface
recipe: `bg-popover`, `border-border-strong`, the level's shadow. Dark lifts `--popover` one step
(`#11111c` → `#161622`) so the surface, not a black smear, separates a menu from the card under it.
The tokens are themed runtime variables behind `@theme inline` entries, the same pattern as
`--card-wash`.

**State: never a shadow, never a glow.** Selected rows use fill + border (navigation uses the
approved `--nav-selected-bg` / `--nav-selected-border`, defined today and unused); unread keeps its
mint wash and count, and its edge goes to mint 45%; counts are flat; focus is one ring.

**Light: a glow means something emits light.** Kept: running/attention/error dots, a live
microphone (holding a Bot, the voice card, the main Bot's centre button while recording), the brand
CTA, the selected-Bot avatar, the onboarding halo, Model Hub wires. Kept glows take the theme's own
accent (dots: 6px at 60% in Light). Decorative glows (icon tiles, logo, eyebrow, Apps launcher) stay
in Dark and are dropped in Light. Removed: every state glow listed above, the card washes, the
new-session button's extra drop shadow.

## v2: edges designed with elevation, and freshness (owner feedback, 2026-11-08)

The owner: opaque grey borders (the input's especially) look dated; a faint shadow beside a
conspicuous border looks cheap; with the glows cut, the UI risks reading flat and dated.

**Edges.** No opaque border on a resting card, panel, row, input, soft button, or floating surface.

| Surface | v2 |
| --- | --- |
| Card, panel, row | Transparent border. Light: `0 0 0 1px ink/.04` plus a soft ambient tinted with the brand's deep teal (`rgb(10 52 44)`); Dark: `0 0 0 1px white/.06` plus a 1px top highlight (`inset 0 1px 0 white/.05`). A card drawn on the page colour takes `--surface`, so its fill separates it. |
| Input, select, textarea, search | Filled (`ink/.045` Light, `white/.05` Dark), no border or shadow; fill deepens on hover; focus is the ring. |
| Outline/secondary button, small bordered action, chip | The same fill, no outline. |
| Floating and overlay | No border; the ring lives in the level's shadow (`ink/.07` Light, `white/.1` plus top highlight Dark). |
| Kept | Selected, focus, error, the dashed "add", table and list dividers. |

Borders stay in the DOM as transparent, so forced-colours mode still paints them, and
`prefers-contrast: more` brings them back at a visible strength.

**Freshness**, two levels:

| Technique | v2a restrained | v2b expressive |
| --- | --- | --- |
| Light shadow colour | brand-tinted instead of grey | same |
| Dark lifted surfaces | top highlight | same |
| Composer | soft edge, mint ring on focus | gradient hairline (mint, cyan, violet) |
| First card on Home | as other cards | gradient hairline, mint ambient |
| Agent working | composer edge turns mint | a light sweeps the composer edge (2.8s); still under reduced motion |
| Glass | phone tab bar | plus menus, popovers, toasts |
| Brand light in Light | none | unread cards and decorative tiles get a same-hue soft shadow instead of a neon halo |

Glass falls back to the opaque surface under `prefers-reduced-transparency` or without
`backdrop-filter`. The Dock stays opaque: it scrolls horizontally, and Chromium does not clip a
scroll container's backdrop to its radius, so its glass needs a non-scrolling wrapper first.

Recommendation: v2a plus three items from v2b (composer gradient hairline, the working sweep, the
Light same-hue soft shadows); glass menus add little over plain backgrounds and cost legibility over
text and GPU.

Accessibility: text colours do not change. With borderless inputs the focus ring becomes the main
focus cue; the Light ring is brand mint at 50% (~1.5:1, owner decision 2026-08-14). Proposed: the
same brand value opaque (~2.5:1), value unchanged.

## Decisions needed (v2)

1. Base: v1's four levels plus v2's edges. (Recommended: adopt.)
2. Freshness: A v2a / B v2b / C v2a plus composer hairline, working sweep, Light soft shadows.
   (Recommended: C.)
3. Dark `--popover` one step lighter. (Recommended: adopt.)
4. Unread: no halo on Inbox cards, stronger mint edge; no left stripe on popover rows.
   (Recommended: adopt.)
5. Owner-approved lights unchanged (brand CTA, selected Bot, live mic, onboarding halo). Confirm.
6. Light focus ring opaque in the same brand value. (Recommended: adopt.)
7. Other fixes: 1, 2, 3, 4, 5, 7, 12 (recommended); with borderless rows, hover fill is the only
   hover cue, which makes fix 1 more important.

## Decisions needed (v1, superseded by the v2 list)

1. Approve the four levels and their Light/Dark values.
2. Lift Dark `--popover` one step and give every floating surface `border-strong`.
3. Decorative glows: Dark only (recommended), remove everywhere, or keep in both.
4. Inbox unread: drop the halo and strengthen the mint edge (recommended).
5. Unchanged by earlier owner decisions: brand CTA glow, selected-Bot avatar halo (including the
   phone tab bar's centre Bot), onboarding halo. Confirm, or soften the Light centre-Bot halo.
6. Which of the other fixes below to include.

## Other fixes (pick separately)

| # | Fix | Evidence | Size |
| --- | --- | --- | --- |
| 1 | Hover is invisible in Light on white surfaces | `hover:bg-surface-2` ×31 (ghost button variant, Agents rows, vault rows); Light `surface`, `surface-2`, `card`, `popover` are all `#fff`; the outline button hovers lighter than it rests | small |
| 2 | Queued-row hover never shows | `hover:bg-surface-1` in ChatPage: no such token | 1 line |
| 3 | One hover and one press wash | eight alphas in use (`foreground/0.02…0.10`); keep `/[0.04]` hover, `/[0.06]` press | medium |
| 4 | One focus ring | `ring-ring`, `ring-cyan/60`, `ring-mint/60`, `/40`, `/30`; `focus:` (draws on click) mixed with `focus-visible:` | medium |
| 5 | One segmented control | Inbox filter (glow) and Diagnostics tabs (raised thumb) hand-roll what `SegmentedRadio` already draws | small |
| 6 | One radius for floating surfaces | Popover md, menus lg, bespoke popovers 2xl, Model Hub 10px → `rounded-xl`; dialogs already mostly `rounded-xl` | small |
| 7 | Use or delete dead tokens | `--shadow-glow-nav-mint`, `--nav-selected-*`, `--nav-hover-bg` | small |
| 8 | Legacy colour aliases | `bg-panel`, `text-text`, `bg-text`, `text-bg`, `bg-bg` ×33, including the Popover and Command primitives | small |
| 9 | One active-tab indicator | Editor tabs: cyan top line; Terminal tabs: mint bottom line | small |
| 10 | Snap arbitrary radii outside approved designs | `rounded-[10px]` ×39, `[9px]` ×12, `[4px]`/`[5px]` ×14, `[14px]` ×6 | medium |
| 11 | Two border strengths per accent | mint borders at 20/25/30/35/40/45/50/60% | wide, low priority |
| 12 | A selected Bot's halo is cut off on the right | in the sidebar strip, the next item (Add, or the next Bot) paints over the selected avatar's halo, leaving a straight edge (`system/elevation/bots-selected-pm-before`) | small |

## Implementation (after decisions)

1. Tokens and primitives: elevation and edge tokens per palette (`--elevation-*`, `--edge*`,
   `--field`) and utilities; Dark `--popover`; Card/Panel, `field.ts` inputs, outline/secondary
   buttons, Popover, ResponsiveMenu, ContextMenu, Dialog, Toast, switch, segmented control. Update
   `system/shape` frames and `glowScale.test.mjs`. Covers most surfaces.
2. Call sites: ~150 hand-written `rounded + border-border + bg-surface` cards and bespoke shadow
   literals onto the primitives or tokens; state glows to fill/border; card washes to the edge.
3. Freshness at the chosen level, with reduced-motion, reduced-transparency, and more-contrast
   fallbacks and tests; theme-following dot and voice glows; new-session button.
4. Each chosen "other fix" as its own small PR.

On approval the frames move to `approved`, the tokens move from the kit into `src/index.css`, and the
kit stylesheet is deleted when the last PR ships.
