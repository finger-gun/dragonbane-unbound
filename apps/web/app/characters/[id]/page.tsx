import CharacterSummaryView from './CharacterSummaryView';

export default function CharacterSummaryPage({ params }: { params: { id: string } }) {
  return <CharacterSummaryView id={params.id} />;
}
