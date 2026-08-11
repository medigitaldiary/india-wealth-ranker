Inline notification banner — confirmations, validation, system messages.

```jsx
<Alert variant="success" title="Order placed" onClose={dismiss}>
  ₹50,000 invested in HDFC 9.1% 2027.
</Alert>
<Alert variant="warning">KYC expires in 3 days — re-verify to keep investing.</Alert>
<Alert variant="info" fill="outline" title="Settlement T+1">Funds reflect by tomorrow 6 PM.</Alert>
```

Variants set color + default Remix icon. `fill="soft"` (tinted, default) or `"outline"` (white + stroke). Pass `onClose` for a dismiss affordance.
