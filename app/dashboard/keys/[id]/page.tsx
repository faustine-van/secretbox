// app/dashboard/keys/[id]/page.tsx
export default function KeyPage({ params }: { params: { id: string } }) {
  return <div>Key Page: {params.id}</div>;
}
