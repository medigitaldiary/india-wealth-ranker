Labelled text field — forms, search, auth, amount entry.

```jsx
<Input label="Email" placeholder="hello@bondscanner.com" leadingIcon={<i className="ri-mail-line" />} />
<Input label="Amount" required hint="Min ₹10,000" leadingIcon={<span>₹</span>} />
<Input label="PAN" error hint="Enter a valid PAN" defaultValue="ABCD" />
<Input placeholder="Search bonds" leadingIcon={<i className="ri-search-line" />} />
```

Sizes `sm`/`md`/`lg`. Focus shows the blue ring; `error` switches border + hint to red. Use `trailing` for units, toggles, or a clear button.
