import EncounterTracker from './EncounterTracker';

export default function EncounterPage({ params }: { params: { id: string } }) {
  return <EncounterTracker id={params.id} />;
}
