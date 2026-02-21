import AdventureDetailView from './AdventureDetailView';

export default function AdventureDetailPage({ params }: { params: { id: string } }) {
  return <AdventureDetailView id={params.id} />;
}
