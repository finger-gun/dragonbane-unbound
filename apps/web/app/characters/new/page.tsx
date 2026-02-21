import { dragonbaneKins, dragonbaneProfessions, dragonbaneSkills } from '@dbu/engine';

import CharacterCreationForm from './CharacterCreationForm';

export default function CharacterCreationPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Create Character</h1>
          <p className="page-subtitle">
            Start with the essentials, preview derived ratings, and lock in trained skills by age.
          </p>
        </div>
        <a className="button secondary" href="/">
          Back to home
        </a>
      </header>

      <CharacterCreationForm
        kins={dragonbaneKins.kins}
        professions={dragonbaneProfessions.professions}
        skills={dragonbaneSkills.skills}
      />
    </div>
  );
}
