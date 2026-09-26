import Link from "next/link";
export default function ProductNotFound() {
  return (
    <main className="page-container section-space">
      <p className="eyebrow text-muted">ATELIER / 404</p>
      <h1 className="text-title mt-6">This piece could not be found.</h1>
      <p className="mt-4 mb-8">
        Explore the collection to find something else.
      </p>
      <Link href="/new-arrivals" className="button button-secondary">
        Back to the collection
      </Link>
    </main>
  );
}
