Primary action control — use for CTAs, form submits, and toolbar actions.

```jsx
<Button>Invest now</Button>
<Button variant="secondary" leadingIcon={<i className="ri-download-2-line" />}>Download</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="danger">Withdraw</Button>
<Button iconOnly variant="secondary" aria-label="More"><i className="ri-more-2-fill" /></Button>
```

Variants: `primary` (blue-900 CTA) · `accent` (blue-500) · `secondary` (stroke) · `ghost` · `danger`. Sizes `sm` 36 / `md` 40 / `lg` 44. Icons are Remix Icon `<i>` elements.
