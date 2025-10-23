import LocalizationButton from "@/src/components/LocaleSwitcher";
import { ThemeToggle } from "@/src/components/theme-toggle";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; [key: string]: string }>;
}>) {
  return (
    <main className="w-full h-full min-h-screen flex flex-col relative">
      <div className="px-4 md:px-7 pt-7 flex items-center gap-2 justify-end">
        <ThemeToggle />
        <LocalizationButton />
      </div>
      <div className="grow w-full h-full flex items-center justify-center p-4">
        {children}
      </div>
    </main>
  );
}
