import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SignUpButton } from "@/components/SignUpButton";
import { QuestBack } from "@/components/quest/QuestBack";

export default function QuestLayout({ children }: LayoutProps<"/rank">) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-surface-card/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" aria-label="BondScanner home">
            <BrandLogo size={30} />
          </Link>
          <SignUpButton />
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-4 -ml-2">
            <QuestBack />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
