import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">NIST 800-369 Security Dashboard</h1>
        <p className="text-gray-400 mb-8">Parent-Facing Cybersecurity Dashboard for K-12 Institutions</p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
