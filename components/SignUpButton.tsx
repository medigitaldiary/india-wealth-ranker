import Link from "next/link";
import { SIGNUP_URL } from "@/lib/config";

const isExternal = /^https?:\/\//.test(SIGNUP_URL);

/**
 * Persistent conversion CTA shown in the nav on every path. Styled as the
 * BondScanner primary button so it reads as the main call to action.
 */
export function SignUpButton() {
  return (
    <Link
      href={SIGNUP_URL}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center justify-center h-9 px-4 rounded-[var(--r-10)] bg-brand text-[var(--text-on-brand)] text-sm font-medium hover:bg-brand-hover active:translate-y-[0.5px] transition-all shrink-0"
      style={{ boxShadow: "var(--shadow-button-primary)" }}
    >
      Sign up
    </Link>
  );
}
