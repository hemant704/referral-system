import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/rewards">Rewards</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
    </nav>
  );
}
