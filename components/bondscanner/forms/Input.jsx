"use client";
import React from "react";

let injected = false;
function useInputStyles() {
  React.useEffect(() => {
    if (injected || typeof document === "undefined") return;
    injected = true;
    const el = document.createElement("style");
    el.id = "bs-input-styles";
    el.textContent = `
.bs-field{font-family:var(--font-sans);display:flex;flex-direction:column;gap:6px;}
.bs-field__label{font-size:14px;font-weight:var(--weight-medium);color:var(--text-title);display:flex;gap:4px;align-items:center;}
.bs-field__req{color:var(--state-error-base);}
.bs-input{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;background:var(--surface-card);
  border:1px solid var(--border-default);border-radius:var(--r-10);box-shadow:var(--shadow-xs);
  transition:border-color .15s ease,box-shadow .15s ease;}
.bs-input:hover{border-color:var(--border-strong);}
.bs-input:focus-within{border-color:var(--primary-base);box-shadow:var(--ring-primary);}
.bs-input input{border:none;outline:none;background:transparent;flex:1;min-width:0;font-family:inherit;font-size:14px;
  line-height:20px;color:var(--text-title);font-feature-settings:var(--ot-ui);}
.bs-input input::placeholder{color:var(--text-muted);}
.bs-input__icon{color:var(--icon-soft-400);font-size:18px;display:inline-flex;flex:none;}
.bs-input--sm{height:36px;}
.bs-input--lg{height:44px;}
.bs-field--error .bs-input{border-color:var(--state-error-base);}
.bs-field--error .bs-input:focus-within{box-shadow:var(--ring-error);}
.bs-field--disabled .bs-input{background:var(--surface-sunken);border-color:var(--border-subtle);box-shadow:none;}
.bs-field--disabled input{color:var(--text-disabled);}
.bs-field__hint{font-size:12px;line-height:16px;color:var(--text-muted);}
.bs-field--error .bs-field__hint{color:var(--state-error-base);}
`;
    document.head.appendChild(el);
  }, []);
}

/**
 * Text input field with label, hint, optional leading/trailing slots and states.
 */
export function Input({
  label,
  hint,
  required = false,
  error = false,
  disabled = false,
  size = "md",
  leadingIcon,
  trailing,
  id,
  style,
  className = "",
  ...rest
}) {
  useInputStyles();
  const fid = id || React.useId();
  return (
    <div
      className={[
        "bs-field",
        error ? "bs-field--error" : "",
        disabled ? "bs-field--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {label && (
        <label className="bs-field__label" htmlFor={fid}>
          {label}
          {required && <span className="bs-field__req">*</span>}
        </label>
      )}
      <div className={`bs-input bs-input--${size}`}>
        {leadingIcon && <span className="bs-input__icon">{leadingIcon}</span>}
        <input id={fid} disabled={disabled} {...rest} />
        {trailing && <span className="bs-input__icon">{trailing}</span>}
      </div>
      {hint && <div className="bs-field__hint">{hint}</div>}
    </div>
  );
}