import EncounterCreationForm from './EncounterCreationForm';

export default function EncounterCreationPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Start an Encounter</h1>
          <p className="page-subtitle">
            Set the initiative order, then advance turns and capture the combat log.
          </p>
        </div>
        <a className="button secondary" href="/">
          Back to home
        </a>
      </header>

      <EncounterCreationForm />
    </div>
  );
}
