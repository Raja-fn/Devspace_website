# Daily Challenge UI/UX Guide

## Visual State Changes

### State 1: Challenge Not Solved (Default)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🔤 Daily Mission • C                    [🔄 Refresh]        │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Pointer Arithmetic Master                                   │
│  Create an array of function pointers and iterate through    │
│  them dynamically without causing a segfault in C.           │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Solve Challenge ▶] [⭐ +20 Aura]  Attempts: 0/3        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Colors:
- Background: Cyan gradient (from-cyan-900/30)
- Border: Cyan-500/20
- Text: White
- Badge: Cyan highlight
```

### State 2: After 1 Attempt (Failed)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🔤 Daily Mission • C                    [🔄 Refresh]        │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Pointer Arithmetic Master                                   │
│  Create an array of function pointers and iterate through    │
│  them dynamically without causing a segfault in C.           │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Solve Challenge ▶] [⭐ +20 Aura]  Attempts: 1/3 ⚠️     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Colors:
- Attempts badge changes: from gray to warning orange
```

### State 3: After 3 Failed Attempts (Max Reached)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🔤 Daily Mission • C                    [🔄 Refresh]        │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Pointer Arithmetic Master                                   │
│  Create an array of function pointers and iterate through    │
│  them dynamically without causing a segfault in C.           │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Solve Challenge ✗] [⭐ +20 Aura]  Attempts: 3/3 ❌    │ │
│  │  ^ Button disabled                  ^ Red styling        │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ℹ️  Come back at 5 AM IST tomorrow to try again            │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Colors:
- Button: Disabled state (red-500/30)
- Attempts badge: Red (red-500/20 bg, red-300 text)
- Info text: Light gray text
```

### State 4: Challenge Solved

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ✓ Daily Mission                         [🔄 Refresh]        │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Today's Problem Solved 🎉                                   │
│  Great job! Come back tomorrow at 5 AM IST for the next     │
│  challenge.                                                  │
│                                                              │
│  ┌──────────────────────────────┐    [⭐ +20 Aura]          │
│  │                              │                           │
│  └──────────────────────────────┘                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Colors:
- Background: Emerald gradient (from-emerald-900/30)
- Border: Emerald-500/20
- Checkmark: Green
- Text: White
- Aura badge: Gold (unchanged)
```

## Modal UI States

### Modal: Initial State (Ready to Code)

```
┌────────────────────────────────────────────────────────────┐
│ C  Pointer Arithmetic Master                           [×] │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Create an array of function pointers and iterate through   │
│ them dynamically without causing a segfault in C.          │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ // Write your pointer logic here...                        │
│ void solve() {                                             │
│                                                            │
│ }                                                          │
│                                                            │
│ [Click to add code...]                                     │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Attempts: 1/3        [Cancel]  [▶ Run Tests]              │
│            (cyan)                                          │
└────────────────────────────────────────────────────────────┘
```

### Modal: Verifying (Loading)

```
┌────────────────────────────────────────────────────────────┐
│ C  Pointer Arithmetic Master                           [×] │
├────────────────────────────────────────────────────────────┤
│ [Instructions...]                                          │
├────────────────────────────────────────────────────────────┤
│ [Your Code Here...]                                        │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Attempts: 1/3        ✨ Verifying memory safety... (spin)  │
│                                                            │
└────────────────────────────────────────────────────────────┘

Colors:
- Sparkle icon: Gold with rotation animation
- Status: Gold text
```

### Modal: Success Result

```
┌────────────────────────────────────────────────────────────┐
│ C  Pointer Arithmetic Master                           [×] │
├────────────────────────────────────────────────────────────┤
│ [Instructions...]                                          │
├────────────────────────────────────────────────────────────┤
│ [Your Code Here...]                                        │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Attempts: 1/3        ✅ Well done! Excellent! +20 Aura    │
│            (cyan)    (green text)                          │
│                      [Close]                               │
│                                                            │
└────────────────────────────────────────────────────────────┘

Colors:
- Checkmark icon: Green (emerald)
- Message: Emerald/green text
- Animation: Pulse/glow effect
```

### Modal: Failure Result

```
┌────────────────────────────────────────────────────────────┐
│ C  Pointer Arithmetic Master                           [×] │
├────────────────────────────────────────────────────────────┤
│ [Instructions...]                                          │
├────────────────────────────────────────────────────────────┤
│ [Your Code Here...]                                        │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Attempts: 2/3        ⚠️  Tests failed. Good attempt! +5    │
│            (orange)  (red text)                            │
│                      [Cancel] [▶ Run Tests]                │
│                      (can retry)                           │
│                                                            │
└────────────────────────────────────────────────────────────┘

Colors:
- Alert icon: Rose/red
- Message: Rose-400 text
- Buttons: Still enabled (can retry)
```

### Modal: Max Attempts Reached

```
┌────────────────────────────────────────────────────────────┐
│ C  Pointer Arithmetic Master                           [×] │
├────────────────────────────────────────────────────────────┤
│ [Instructions...]                                          │
├────────────────────────────────────────────────────────────┤
│ [Your Code Here - Disabled]                               │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Attempts: 3/3        ⚠️  Max attempts reached!             │
│            (red)     (red text)                            │
│                      [Close]                               │
│                      (no retry button)                     │
│                                                            │
└────────────────────────────────────────────────────────────┘

Colors:
- Alert icon: Rose/red
- Message: Rose-400 text
- Attempts badge: Red background with red text
- Textarea: Disabled/grayed out
- Run Tests button: Not shown
```

## Color Scheme

### Primary Colors

| State | Color | Hex |
|-------|-------|-----|
| Unsolved | Cyan | `#06B6D4` |
| Solved | Emerald | `#10B981` |
| Error/Max | Rose/Red | `#F43F5E` |
| Warning | Orange | `#F97316` |
| Gold/Aura | Gold | `#F5C140` |

### Background/Border Colors

| Element | Color |
|---------|-------|
| Card BG | `from-cyan-900/30` |
| Card Border | `cyan-500/20` |
| Badge Checkmark | Emerald |
| Modal BG | `#0a0a0a` |
| Input BG | Transparent |

## Animation Effects

### Transitions
- Button hover: Scale 1.04 → 1.05
- Button click: Scale 0.95
- Card hover: Border/shadow enhancement
- Result text: Pulse animation (2s infinite)

### Spinners
- Verify spinner: 0.8s rotation
- Loading sparkle: Continuous rotation

### Entrance
- Modal: Fade in + scale up (0.2s ease-out)
- Result messages: Fade in instantly
- Green badge: Replaces card with fade transition

## Interactive States

### Button States

**Enabled State:**
```
┌─────────────────┐
│ Solve Challenge │ ← Cyan, hover scale, clickable
└─────────────────┘
```

**Disabled State:**
```
┌─────────────────┐
│ Solve Challenge │ ← Red/faded, no hover, cursor-not-allowed
└─────────────────┘
```

**Loading State:**
```
┌─────────────────┐
│ ✨ Running...   │ ← Spinning icon, disabled
└─────────────────┘
```

## Responsive Design

### Desktop (≥1024px)
- Cyan card full width
- Modal: max-w-2xl (896px)
- Font: 15px (titles)
- Padding: 6 (24px)

### Tablet (768px - 1024px)
- Card responsive
- Modal: 90vw width
- Font: 14px
- Padding: 5 (20px)

### Mobile (<768px)
- Full width card
- Modal: Full viewport
- Font: 13px
- Padding: 4 (16px)
- Button text may wrap

## Accessibility

### Screen Readers
- All buttons have clear labels
- Modal has proper heading hierarchy
- Status messages announced
- Disabled state clearly marked

### Keyboard Navigation
- Tab through buttons
- Enter/Space to activate
- Escape to close modal
- Textarea focusable

### Color Contrast
- All text meets WCAG AA standards
- Color not only indicator (icons + text)
- High contrast backgrounds

---

**Note:** All UI states automatically reflect the current data from Supabase in real-time.
