import { AppInfo } from '@dbu/types';
import { formatTagline } from '@dbu/utils';

const appInfo: AppInfo = {
  name: 'Dragonbane Unbound',
  tagline: 'Run Dragonbane at the speed of play.',
  stage: 'alpha',
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">Local-first tabletop platform</span>
        <h1>{appInfo.name}</h1>
        <p className="lede">{formatTagline(appInfo.tagline)}</p>
        <div className="meta">
          <span className="pill">Stage: {appInfo.stage}</span>
          <span className="pill">Monorepo scaffolded</span>
          <span className="pill">Supabase-ready</span>
        </div>
        <a className="cta" href="/">
          Explore the platform vision
        </a>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Rules Engine</h2>
          <p>Deterministic, data-driven rules so every roll is auditable and portable.</p>
        </article>
        <article className="card">
          <h2>Character Flow</h2>
          <p>Fast creation and clean progression flows built to keep tables moving.</p>
        </article>
        <article className="card">
          <h2>Local Supabase</h2>
          <p>Offline-first by default with a Docker-backed dev stack.</p>
        </article>
        <article className="card">
          <h2>Community Packs</h2>
          <p>Modular content packs that can be enabled, disabled, or forked.</p>
        </article>
      </section>
    </main>
  );
}
