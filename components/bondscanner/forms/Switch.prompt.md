Boolean toggle — settings, opt-ins, "auto-invest" style switches.

```jsx
<Switch defaultChecked />
<Switch checked={notify} onChange={setNotify} />
<Switch size="sm" disabled />
```

On = brand blue-900 track. Controlled (`checked`+`onChange`) or uncontrolled (`defaultChecked`). Pair with a `<label>` for context.
