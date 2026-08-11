Underline tab bar for switching views within a page (Portfolio / Explore / Activity).

```jsx
<Tabs
  defaultValue="explore"
  items={[
    { value: "explore", label: "Explore", icon: <i className="ri-compass-3-line" /> },
    { value: "portfolio", label: "Portfolio", badge: 8 },
    { value: "activity", label: "Activity" },
  ]}
  onChange={setTab}
/>
```

Active tab gets a blue-900 underline. Controlled (`value`+`onChange`) or uncontrolled (`defaultValue`). Items support optional `icon` and `badge`.
