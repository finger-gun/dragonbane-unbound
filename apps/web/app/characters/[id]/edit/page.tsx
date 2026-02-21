import CharacterEditView from './CharacterEditView';

export default function CharacterEditPage({ params }: { params: { id: string } }) {
  return <CharacterEditView id={params.id} />;
}
