"use client";
import React from "react";

/* Inject component CSS once so :hover / :active / :focus-visible are real. */
let injected = false;
function useButtonStyles() {
  React.useEffect(() => {
    if (injected || typeof document === "undefined") return;
    injected = true;
    const el = document.createElement("style");
    el.id = "bs-button-styles";
    el.textContent = `
.bs-btn{font-family:var(--font-sans);font-weight:var(--weight-medium);display:inline-flex;align-items:center;justify-content:center;gap:8px;
  border:1px solid transparent;border-radius:var(--r-10);cursor:pointer;white-space:nowrap;text-decoration:none;user-select:none;
  transition:background .15s ease,border-color .15s ease,color .15s ease,box-shadow .15s ease,transform .05s ease;
  font-feature-settings:var(--ot-ui);-webkit-font-smoothing:antialiased;}
.bs-btn:focus-visible{outline:none;box-shadow:var(--ring-primary);}
.bs-btn:active{transform:translateY(.5px);}
.bs-btn[disabled]{cursor:not-allowed;opacity:1;}
.bs-btn svg{flex:none;}

/* sizes */
.bs-btn--sm{height:36px;padding:0 12px;font-size:14px;line-height:20px;}
.bs-btn--md{height:40px;padding:0 16px;font-size:14px;line-height:20px;}
.bs-btn--lg{height:44px;padding:0 20px;font-size:16px;line-height:24px;}
.bs-btn--icon.bs-btn--sm{width:36px;padding:0;}
.bs-btn--icon.bs-btn--md{width:40px;padding:0;}
.bs-btn--icon.bs-btn--lg{width:44px;padding:0;}

/* primary — brand CTA */
.bs-btn--primary{background:var(--primary-cta-button);color:var(--text-on-brand);box-shadow:var(--shadow-button-primary);}
.bs-btn--primary:hover{background:var(--brand-hover);}
.bs-btn--primary[disabled]{background:var(--bg-soft-200);color:var(--text-disabled);box-shadow:none;}

/* accent — solid blue 500 */
.bs-btn--accent{background:var(--primary-base);color:var(--text-on-brand);box-shadow:var(--shadow-button);}
.bs-btn--accent:hover{background:var(--blue-600);}
.bs-btn--accent[disabled]{background:var(--bg-soft-200);color:var(--text-disabled);box-shadow:none;}

/* secondary — stroke */
.bs-btn--secondary{background:var(--surface-card);color:var(--text-title);border-color:var(--border-default);box-shadow:var(--shadow-xs);}
.bs-btn--secondary:hover{background:var(--surface-sunken);border-color:var(--border-strong);}
.bs-btn--secondary[disabled]{color:var(--text-disabled);border-color:var(--border-subtle);background:var(--surface-card);box-shadow:none;}

/* ghost */
.bs-btn--ghost{background:transparent;color:var(--text-title);}
.bs-btn--ghost:hover{background:var(--surface-sunken);}
.bs-btn--ghost[disabled]{color:var(--text-disabled);background:transparent;}

/* danger */
.bs-btn--danger{background:var(--state-error-base);color:var(--text-on-brand);box-shadow:var(--shadow-button-primary);}
.bs-btn--danger:hover{background:var(--red-900);}
.bs-btn--danger:focus-visible{box-shadow:var(--ring-error);}
.bs-btn--danger[disabled]{background:var(--bg-soft-200);color:var(--text-disabled);box-shadow:none;}
`;
    document.head.appendChild(el);
  }, []);
}

/**
 * Primary action button. Renders as <button>, or <a> when `href` is given.
 */
export function Button({
  variant = "primary",
  size = "md",
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  href,
  children,
  className = "",
  ...rest
}) {
  useButtonStyles();
  const cls = [
    "bs-btn",
    `bs-btn--${variant}`,
    `bs-btn--${size}`,
    iconOnly ? "bs-btn--icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {leadingIcon}
      {!iconOnly && children}
      {iconOnly && children}
      {trailingIcon}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}