# Blinkit-Inspired Design System Specification

> **Version**: 1.0.0  
> **Target Applications**: Customer Web App, Admin Dashboard, Rider Web App  
> **Source of Truth**: Visual design language, design tokens, UI components, responsive layout standards, and quick-commerce UX guidelines.

---

## 1. Brand & Design Direction

The design system is modeled after modern quick-commerce leaders (inspired by Blinkit), built around extreme speed, instant clarity, high visual appetite appeal, and frictionless micro-interactions.

* **Aesthetic**: Clean, modern, vibrant, grocery-first, and ultra-scannable.
* **Emotional Tone**: Reliable, energetic, fresh, and lightning-fast.
* **Core Metaphor**: 10-to-15 minute grocery fulfillment. Information density must balance quick decision-making with high-contrast legibility.
* **Multi-Platform Consistency**:
  * **Customer App**: High-vibrancy product display, fast category navigation, sticky cart preview, and live delivery timeline.
  * **Admin App**: Dense tabular data, operational status indicators, quick batch actions, high contrast for continuous desk usage.
  * **Rider App**: High-contrast, large touch targets (minimum 48px), optimized for outdoor daylight visibility and single-handed thumb interaction.

---

## 2. Color System & Design Tokens

### 2.1 CSS Custom Properties Token Sheet

```css
:root {
  /* Brand Core */
  --color-brand-primary: #0c831f;       /* Iconic Blinkit deep grocery green */
  --color-brand-primary-hover: #0a6f1a;
  --color-brand-primary-light: #e8f5e9; /* Light green tint for active pills, quantity counters */
  --color-brand-accent: #f7c200;        /* Yellow badge / highlight accent */
  --color-brand-accent-text: #2d2a00;

  /* Neutrals & Text */
  --color-text-primary: #1c1c1c;        /* Main headings & primary labels */
  --color-text-secondary: #666666;      /* Subtitles, unit weight, secondary metadata */
  --color-text-muted: #8e8e8e;          /* Disabled states, placeholders */
  --color-text-inverse: #ffffff;        /* White text for buttons/badges */

  /* Backgrounds & Surfaces */
  --color-bg-page: #f4f6f8;             /* App page background canvas */
  --color-bg-surface: #ffffff;          /* Card & modal containers */
  --color-bg-subtle: #f8f9fa;           /* Table alternate rows, search input bg */
  --color-bg-elevated: #ffffff;         /* Dropdowns, floating carts, dialogs */

  /* Borders & Dividers */
  --color-border-subtle: #f0f0f0;       /* Card inner separators */
  --color-border-default: #e2e5e9;      /* Standard container borders */
  --color-border-focus: #0c831f;        /* Input active / focus outline */

  /* Functional / Feedback */
  --color-success: #0c831f;
  --color-success-bg: #e8f5e9;
  --color-warning: #e67e22;
  --color-warning-bg: #fdf2e9;
  --color-error: #d32f2f;
  --color-error-bg: #fde8e8;
  --color-info: #0288d1;
  --color-info-bg: #e1f5fe;

  /* Order Lifecycle States */
  --color-status-created: #6c757d;      /* Order Placed */
  --color-status-created-bg: #f1f3f5;
  --color-status-accepted: #0288d1;     /* Store Accepted */
  --color-status-accepted-bg: #e1f5fe;
  --color-status-packing: #f39c12;      /* Packing Items */
  --color-status-packing-bg: #fef5e7;
  --color-status-out-for-delivery: #8e44ad; /* Rider on the way */
  --color-status-out-for-delivery-bg: #f4ecf7;
  --color-status-delivered: #0c831f;    /* Completed */
  --color-status-delivered-bg: #e8f5e9;
  --color-status-cancelled: #d32f2f;    /* Cancelled / Failed */
  --color-status-cancelled-bg: #fde8e8;
}
```

---

## 3. Typography

### 3.1 Recommended Font Stack
* **Primary Family**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
* **Display / Accent Headings**: `'Outfit', 'Inter', sans-serif` (clean, rounded, modern geometry for promo banners and quick badges)
* **Monospace / Order Codes**: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace` (for tracking IDs, SKU codes)

### 3.2 Type Scale

| Level | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 32px (`2.0rem`) | 24px (`1.5rem`) | 800 (Extrabold) | 1.2 | -0.02em | Landing banners, marketing headlines |
| **Heading 1** | 24px (`1.5rem`) | 20px (`1.25rem`) | 700 (Bold) | 1.25 | -0.015em | App page titles, Cart summary header |
| **Heading 2** | 20px (`1.25rem`) | 18px (`1.125rem`) | 700 (Bold) | 1.3 | -0.01em | Category section headers, Modal titles |
| **Heading 3** | 16px (`1.0rem`) | 15px (`0.938rem`) | 600 (Semibold) | 1.35 | 0 | Card titles, Product names |
| **Body Large** | 16px (`1.0rem`) | 15px (`0.938rem`) | 400 / 500 | 1.5 | 0 | Order details, descriptions |
| **Body Default** | 14px (`0.875rem`) | 14px (`0.875rem`) | 400 (Regular) | 1.45 | 0 | Standard text, form inputs, table data |
| **Body Small / Meta**| 12px (`0.75rem`) | 12px (`0.75rem`) | 500 (Medium) | 1.4 | +0.01em | Product weights (`500 g`), timestamps, subtitles |
| **Micro / Badge** | 10px (`0.625rem`) | 10px (`0.625rem`) | 700 (Bold) | 1.2 | +0.02em | Delivery time badge (`⚡ 8 MINS`), DISCOUNT tags |

---

## 4. Spacing & Sizing System

Based on a strict **4px/8px incremental grid**.

### 4.1 Spacing Scale

| Token | Pixels | Rem Value | Common Purpose |
| :--- | :--- | :--- | :--- |
| `--space-1` | 4px | 0.25rem | Inline chip padding, micro gaps |
| `--space-2` | 8px | 0.5rem | Gap between badge and text, icon padding |
| `--space-3` | 12px | 0.75rem | Compact card padding, input vertical padding |
| `--space-4` | 16px | 1.0rem | Standard card body padding, row gaps |
| `--space-5` | 20px | 1.25rem | Section gaps on mobile, drawer padding |
| `--space-6` | 24px | 1.5rem | Standard page section vertical gap |
| `--space-8` | 32px | 2.0rem | Desktop section separation |
| `--space-12`| 48px | 3.0rem | Hero section margin, landing layout blocks |

### 4.2 Standard Layout Boundaries
* **Max Container Width (Desktop)**: `1280px`
* **Admin Dashboard Container**: Full width with `min-width: 1024px` and fluid grid.
* **Mobile Viewport Target**: Responsive fluid down to `360px` minimum width.
* **Page Gutter / Margin**:
  * Desktop: `32px`
  * Tablet: `20px`
  * Mobile: `16px`

---

## 5. UI Components Blueprint

### 5.1 Navbar
* **Customer**: Sticky top bar (`height: 72px` desktop, `60px` mobile).
  * Brand logo (`blinkit` stylized wordmark in green and yellow).
  * Fast location selector ("Delivery in 8 mins" + arrow dropdown with stored address).
  * Expanded central search bar.
  * Login / Profile button.
  * Sticky cart preview button with item counter & total amount (`₹249 | 2 items`).
* **Admin**: Slim header with dark store selector, real-time alert notifications, system status, and user avatar.
* **Rider**: Minimalist high-contrast header: Duty toggle (Online/Offline), current active batch status, emergency helpline shortcut.

### 5.2 Search Bar
* **Appearance**: Pill-shaped or subtle rounded rect (`border-radius: 12px`), background `--color-bg-subtle`, border `--color-border-default`.
* **Behavior**:
  * Left icon: Search magnifying glass.
  * Animated cycling placeholder (`"Search 'milk'..."`, `"Search 'bread'..."`, `"Search 'chips'..."`).
  * Right action: Clear button (`✕`) when text is typed.
  * Instant auto-suggest dropdown with category suggestions and instant product match count.

### 5.3 Category Card
* **Customer**: Vertical card with pastel background container for image.
* **Dimensions**: Width `96px` to `120px` in horizontal scrolling rails or 4–6 column grid.
* **Structure**:
  1. Rounded square thumbnail image container (`border-radius: 12px`, soft contrast bg).
  2. Category name (`12px`, font-weight 600, centered, max 2 lines).

### 5.4 Product Card
* **Dimensions**: Desktop grid `180px–220px` width; Mobile 2-column grid (`calc(50% - 8px)`).
* **Structure**:
  1. **Top Badge**: Delivery ETA tag (`⚡ 8 MINS`) or discount pill (`15% OFF`) positioned top-left.
  2. **Image Area**: Square aspect ratio (`1:1`), crisp white background, padded product packshot with hover zoom (`transform: scale(1.04)`).
  3. **Metadata**:
     * Unit / Pack size: `--color-text-secondary`, `12px` (e.g., `500 ml`, `1 kg`, `Pack of 2`).
     * Product Title: `--color-text-primary`, `14px`, semibold, max 2-line clamp.
  4. **Footer Action Row**:
     * Price area: Current price in bold (`₹45`) + original MRP crossed out (`₹60`).
     * Action: Standard green bordered **ADD** button, transitioning immediately into a quantity counter upon click.

### 5.5 Quantity Controls (Add / Stepper)
* **Initial State**:
  * Button text: `ADD`
  * Appearance: White button with border `1px solid var(--color-brand-primary)`, bold green text `var(--color-brand-primary)`, `border-radius: 8px`, `height: 34px`, `min-width: 68px`.
* **Active State (Count > 0)**:
  * Full filled green pill or light green card with `minus (-)` button, numerical value, and `plus (+)` button.
  * Interactive feedback: Instant increment/decrement with optimistic UI and micro-bounce animation.

### 5.6 Buttons
* **Primary Button**: Background `--color-brand-primary`, text `--color-text-inverse`, font-weight 600, `border-radius: 10px`, `padding: 12px 20px`.
* **Secondary / Outline**: White background, `border: 1.5px solid var(--color-brand-primary)`, green text.
* **Destructive Button**: Background `--color-error`, text white, used for canceling orders or admin item deletion.
* **Touch Targets**: Minimum `44px` height on customer web, minimum `48px` height on rider app.

### 5.7 Inputs & Form Fields
* **Default**: Height `44px`, `border: 1px solid var(--color-border-default)`, `border-radius: 8px`, `padding: 0 14px`, font size `14px`.
* **Focus**: `border-color: var(--color-brand-primary)`, outline `2px solid rgba(12, 131, 31, 0.15)`.
* **Invalid State**: `border-color: var(--color-error)`, display red helper text below input (`12px`).

### 5.8 Badges & Pills
* **Delivery ETA Pill**: Yellow background `--color-brand-accent` with dark text, or light green `--color-brand-primary-light` with dark green text.
* **Status Badges**: Rounded pills (`border-radius: 100px`, `padding: 4px 10px`, font size `11px`, bold uppercase).

### 5.9 Modals & Dialogs
* Backdrop: `rgba(0, 0, 0, 0.5)` with `backdrop-filter: blur(4px)`.
* Modal Container: Center aligned, `border-radius: 16px`, `box-shadow: var(--shadow-lg)`, `max-width: 520px`.
* Mobile Behavior: Bottom sheet transition sliding up from screen bottom.

### 5.10 Cart
* **Slide-over Drawer (Desktop & Tablet)**:
  * Right-anchored drawer `380px–420px` width.
  * Header with item count and estimated delivery timeline.
  * Item list with quantity steppers, unit weights, itemized prices.
  * Bill details section: Item Total, Delivery Fee (`Free` if above threshold or `₹15`), Handling Fee (`₹2`), Grand Total.
  * Sticky checkout action button: `Proceed to Pay → ₹342`.
* **Mobile Floating Cart Bar**:
  * Sticks to bottom above navigation bar (`bottom: 12px`, full width minus margins).
  * Shows total items count, price, and "View Cart" CTA with arrow icon.

### 5.11 Order Card (Customer & Admin)
* Display order ID (`#ORD-98421`), store branch, timestamp, thumbnail preview of first 3 items with `+X more` count.
* Summary total, current status badge, and dynamic action button ("Track Order" or "Download Invoice").

### 5.12 Order Status Tracker
* Horizontal stepper on desktop / Vertical timeline on mobile:
  1. **Order Placed**: Checked immediately upon checkout.
  2. **Order Accepted & Packing**: Dark store personnel picking items.
  3. **Order Out for Delivery**: Assigned rider name, phone icon, and live ETA countdown.
  4. **Delivered**: Green checkmark with satisfaction rating prompt.

### 5.13 Admin Data Table
* Container: White surface with `border: 1px solid var(--color-border-default)`, `border-radius: 10px`.
* Header: Background `--color-bg-subtle`, uppercase bold labels `12px`, letter spacing `0.05em`.
* Rows: Alternating hover highlight (`--color-bg-subtle`), vertical padding `12px`, cell border bottom `1px solid var(--color-border-subtle)`.
* Controls: Quick search, status filter pills, bulk select checkboxes, pagination toolbar.

### 5.14 Admin / Rider Sidebar
* Desktop: Fixed left navigation (`width: 240px`), clean vertical icon + text links.
* Active state: Left border `3px solid var(--color-brand-primary)`, background `--color-brand-primary-light`, text color `--color-brand-primary` with font-weight 600.

### 5.15 Rider Order Card
* High-density, high-legibility card designed for outdoor thumb usage:
  * Giant Order ID & Customer Address snippet.
  * Item count + bulky order warning if applicable (`e.g., 5L Water Cans`).
  * Big status CTA: `Swipe or Tap to Accept` -> `Arrived at Store` -> `Start Delivery` -> `Mark Delivered`.
  * One-tap calling button and Google Maps navigation shortcut.

---

## 6. Responsive Breakpoints & Layout Rules

| Device Class | Breakpoint Range | Columns / Grid Pattern | Navigation Mode |
| :--- | :--- | :--- | :--- |
| **Mobile** | `< 768px` | 2 columns for products, full width list for orders | Bottom nav bar + Top sticky search |
| **Tablet** | `768px – 1023px` | 3 to 4 columns for products, 2 columns for cards | Collapsible drawer / Compact topbar |
| **Desktop** | `1024px – 1440px`| 5 to 6 columns for products, permanent sidebars | Full sticky navbar with expanded search |
| **Wide / Ultrawide** | `> 1440px` | Centered container max `1280px` or `1440px` | Centered content with ample margins |

---

## 7. Design System Rules

### 7.1 Border Radius Tokens
* `--radius-xs`: `4px` (micro badges, tags)
* `--radius-sm`: `8px` (buttons, inputs, counter steppers)
* `--radius-md`: `12px` (product cards, category tiles, banners)
* `--radius-lg`: `16px` (modals, bottom sheets, checkout summaries)
* `--radius-full`: `9999px` (pills, search inputs, avatar icons)

### 7.2 Elevation & Shadows
* `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (subtle cards)
* `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)` (interactive hover cards, dropdowns)
* `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` (modals, floating cart, drawer)
* `--shadow-sticky-bottom`: `0 -4px 12px rgba(0, 0, 0, 0.08)` (sticky bottom cart bar on mobile)

### 7.3 Interaction & Animation States
* **Hover Transitions**: Standard ease transition `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`. Product cards elevate slightly (`transform: translateY(-2px)`).
* **Focus States**: Accessible focus ring with `outline: 2px solid var(--color-brand-primary)` and `outline-offset: 2px`.
* **Loading States**: Shimmer skeleton blocks using animated CSS linear gradients (`#eee` to `#f5f5f5` to `#eee`). Avoid blocking spinners for cards.
* **Empty States**: Friendly illustration or icon, bold empathetic heading (e.g., `"Your cart is empty"`), supportive subtitle, and clear green action CTA (`"Start Shopping"`).
* **Error States**: Inline alert banners with light red background, dark red text, clear retry button.

---

## 8. Quick-Commerce Specific UX Rules

1. **The 10-Minute Promise Must Be Visible Everywhere**:
   Every screen should reinforce speed. Show the delivery ETA (`⚡ 8-12 MINS`) in the header and on product cards.
2. **Frictionless "Add to Cart"**:
   Clicking **ADD** must not require navigating to a product details page. Quantities must increment/decrement directly from any grid or search result with immediate optimistic response.
3. **Persistent Cart Awareness**:
   The user should never have to search for their cart. Show the item counter and subtotal prominently in the desktop header, and through a floating bottom cart bar on mobile.
4. **Transparent Out-of-Stock Handling**:
   Never hide out-of-stock items abruptly if a user might be searching for them. Dim the card opacity (0.5), disable the ADD button with an `"Out of Stock"` label, and provide a `"Notify Me"` or `"Similar Items"` option.
5. **Clear Pack Size & Price Units**:
   Always clearly state unit weight (`500 g`, `1 L`, `Pack of 4`) directly above the price to avoid grocery ordering mistakes.
6. **One-Screen Checkout**:
   Checkout must be rapid: Address confirmation + Payment mode selector + Bill breakdown in a single cohesive view.
7. **Real-time Order Transparency**:
   Once placed, immediate transition to order status tracking without needing manual page refreshes.
8. **Rider Ergonomics**:
   Rider interfaces must be operable with single-thumb taps while standing or wearing gloves; keep critical actions at the bottom of the viewport with distinct color-coded confirmations.
