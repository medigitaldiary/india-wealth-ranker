Standard surface container — wrap any grouped content (widgets, lists, forms, summaries).

```jsx
<Card title="Recent activity" action={<Button variant="ghost" size="sm">See all</Button>}>
  …rows…
</Card>
<Card subtitle="Secured · AAA rated" padding={24}>…</Card>
```

White surface, 1px subtle stroke, soft `--shadow-xs`, 16px radius. Pass `title`/`subtitle`/`action` to get the standard header, or omit for a bare padded surface.
