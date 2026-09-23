import Link from "next/link";

export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-white/5 px-6 py-8 text-center">
      <p className="text-xs text-muted">
        © {new Date().getFullYear()} {name}.{" "}
        <Link href="/admin" className="underline decoration-dotted underline-offset-2 hover:text-secondary">
          Admin
        </Link>
      </p>
    </footer>
  );
}
