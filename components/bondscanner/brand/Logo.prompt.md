Brand logo lockup and bare compass mark — use at the top of any BondScanner surface (nav, auth, email, slides).

```jsx
<Logo />                              {/* blue badge + wordmark on light bg */}
<Logo variant="inverse" />            {/* on a dark/brand bg */}
<Logo showWordmark={false} size={32}/> {/* badge only, e.g. compact nav */}
<LogoMark size={20} color="var(--gray-0)" /> {/* glyph inside another shape */}
```

Variants: `primary`/`light` (blue badge, white mark, blue wordmark) · `inverse`/`dark` (white badge, blue mark, white wordmark). Never recolor the glyph outside these pairings or place the blue lockup on a dark surface.
