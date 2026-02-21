'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { CharacterAttributes } from '@dbu/types';
import { buildCharacterSkills, computeDerivedRatings, getAgeSkillSlots } from '@dbu/engine';

import { getSupabaseClient } from '../../../lib/supabaseClient';

type KinOption = {
  id: string;
  name: string;
  name_sv: string;
};

type ProfessionOption = {
  id: string;
  name: string;
  name_sv: string;
  skills: Array<{ id: string; name: string; name_sv: string }>;
};

type SkillData = {
  base_skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>;
  weapon_skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>;
  secondary_skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>;
};

type CharacterCreationFormProps = {
  kins: KinOption[];
  professions: ProfessionOption[];
  skills: SkillData;
};

const defaultAttributes: CharacterAttributes = {
  STR: 10,
  CON: 10,
  AGL: 10,
  INT: 10,
  WIL: 10,
  CHA: 10,
};

export default function CharacterCreationForm({ kins, professions, skills }: CharacterCreationFormProps) {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [kinId, setKinId] = useState(kins[0]?.id ?? 'human');
  const [age, setAge] = useState<'Young' | 'Middle-Aged' | 'Old'>('Middle-Aged');
  const [professionId, setProfessionId] = useState(professions[0]?.id ?? 'bard');
  const [weakness, setWeakness] = useState('');
  const [appearance, setAppearance] = useState('');
  const [attributes, setAttributes] = useState<CharacterAttributes>(defaultAttributes);
  const [professionSelection, setProfessionSelection] = useState<string[]>([]);
  const [freeSkillIds, setFreeSkillIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = useMemo(() => getAgeSkillSlots(age), [age]);
  const professionSkills = useMemo(() => {
    const profession = professions.find((item) => item.id === professionId);
    return profession?.skills ?? [];
  }, [professionId, professions]);

  const allProfessionSkillIds = useMemo(
    () => professionSkills.map((skill) => skill.id),
    [professionSkills]
  );

  const trainedSkillIds = useMemo(() => {
    const merged = new Set([...professionSelection, ...freeSkillIds]);
    return Array.from(merged);
  }, [professionSelection, freeSkillIds]);

  const previewSkills = useMemo(
    () => buildCharacterSkills(attributes, trainedSkillIds),
    [attributes, trainedSkillIds]
  );

  const derived = useMemo(() => computeDerivedRatings(attributes, kinId).derived, [attributes, kinId]);

  const skillOptions = useMemo(
    () => [...skills.base_skills, ...skills.weapon_skills],
    [skills.base_skills, skills.weapon_skills]
  );

  const handleAttributeChange = (key: keyof CharacterAttributes, value: number) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFreeSkill = (skillId: string) => {
    if (professionSelection.includes(skillId)) return;

    setFreeSkillIds((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      }

      if (prev.length >= slots.freeChoice) {
        return prev;
      }

      return [...prev, skillId];
    });
  };

  const toggleProfessionSkill = (skillId: string) => {
    setProfessionSelection((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      }

      if (prev.length >= slots.fromProfession) {
        return prev;
      }

      return [...prev, skillId];
    });
  };

  useEffect(() => {
    setFreeSkillIds((prev) => prev.filter((id) => !professionSelection.includes(id)));
  }, [professionSelection]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      if (!characterName) {
        setError('Character name is required.');
        setSaving(false);
        return;
      }

      if (trainedSkillIds.length !== slots.total) {
        setError(`Select exactly ${slots.total} trained skills for this age.`);
        setSaving(false);
        return;
      }

      if (professionSelection.length !== slots.fromProfession) {
        setError(`Select exactly ${slots.fromProfession} profession skills.`);
        setSaving(false);
        return;
      }

      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setError('You must be signed in to save a character.');
        setSaving(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          header: {
            player_name: playerName || null,
            character_name: characterName,
            kin_id: kinId,
            age,
            profession_id: professionId,
            weakness: weakness || null,
            appearance: appearance || null,
          },
          attributes,
          trained_skill_ids: trainedSkillIds,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Failed to save character.');
      }

      const payload = (await response.json()) as { character?: { id: string } };
      if (payload.character?.id) {
        router.push(`/characters/${payload.character.id}`);
      } else {
        throw new Error('Character saved but id missing.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setSaving(false);
      return;
    }
  };

  return (
    <div className="form-grid">
      <section className="panel">
        <h2>Identity</h2>
        <div className="form-grid two">
          <label className="field">
            Player name
            <input
              className="input"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Table name"
            />
          </label>
          <label className="field">
            Character name
            <input
              className="input"
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Hero name"
            />
          </label>
          <label className="field">
            Kin
            <select className="select" value={kinId} onChange={(event) => setKinId(event.target.value)}>
              {kins.map((kin) => (
                <option key={kin.id} value={kin.id}>
                  {kin.name} / {kin.name_sv}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Age
            <select className="select" value={age} onChange={(event) => setAge(event.target.value as typeof age)}>
              <option value="Young">Young</option>
              <option value="Middle-Aged">Middle-Aged</option>
              <option value="Old">Old</option>
            </select>
          </label>
          <label className="field">
            Profession
            <select
              className="select"
              value={professionId}
              onChange={(event) => {
                setProfessionId(event.target.value);
                setProfessionSelection([]);
                setFreeSkillIds([]);
              }}
            >
              {professions.map((profession) => (
                <option key={profession.id} value={profession.id}>
                  {profession.name} / {profession.name_sv}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Weakness
            <input
              className="input"
              value={weakness}
              onChange={(event) => setWeakness(event.target.value)}
              placeholder="Optional"
            />
          </label>
          <label className="field">
            Appearance
            <input
              className="input"
              value={appearance}
              onChange={(event) => setAppearance(event.target.value)}
              placeholder="Optional"
            />
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Base Attributes</h2>
        <div className="form-grid two">
          {(Object.keys(attributes) as Array<keyof CharacterAttributes>).map((key) => (
            <label key={key} className="field">
              {key}
              <input
                className="input"
                type="number"
                min={3}
                max={18}
                value={attributes[key]}
                onChange={(event) => handleAttributeChange(key, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Derived Ratings Preview</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <span>HP</span>
            <strong>{attributes.CON}</strong>
          </div>
          <div className="stat-card">
            <span>WP</span>
            <strong>{attributes.WIL}</strong>
          </div>
          <div className="stat-card">
            <span>Movement</span>
            <strong>{derived.movement}</strong>
          </div>
          <div className="stat-card">
            <span>Damage Bonus STR</span>
            <strong>{derived.damage_bonus_str ?? 'None'}</strong>
          </div>
          <div className="stat-card">
            <span>Damage Bonus AGL</span>
            <strong>{derived.damage_bonus_agl ?? 'None'}</strong>
          </div>
          <div className="stat-card">
            <span>Carry Slots</span>
            <strong>{derived.carrying_capacity}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Trained Skills</h2>
        <p className="help-text">
          Choose {slots.fromProfession} profession skills and {slots.freeChoice} free skills (
          {trainedSkillIds.length}/{slots.total} selected).
        </p>
        <h3>Profession Skills</h3>
        <div className="skill-grid">
          {professionSkills.map((skill) => {
            const checked = professionSelection.includes(skill.id);
            return (
              <div key={skill.id} className="skill-card">
                <label>
                  <span>{skill.name}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProfessionSkill(skill.id)}
                  />
                </label>
                <small>{skill.name_sv} · profession</small>
              </div>
            );
          })}
        </div>
        <h3>Free Skills</h3>
        <div className="skill-grid">
          {skillOptions.map((skill) => {
            const checked = trainedSkillIds.includes(skill.id);
            const locked = professionSelection.includes(skill.id);
            return (
              <div key={skill.id} className="skill-card">
                <label>
                  <span>{skill.name}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={locked}
                    onChange={() => toggleFreeSkill(skill.id)}
                  />
                </label>
                <small>
                  {skill.name_sv} · {skill.attribute}
                  {allProfessionSkillIds.includes(skill.id) ? ' · profession' : ''}
                </small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <h2>Skill Preview</h2>
        <div className="summary-grid">
          {previewSkills.skills.map((skill) => (
            <div key={skill.id} className="summary-card">
              <strong>{skill.name}</strong>
              <div className="summary-list">
                <span>{skill.name_sv}</span>
                <span>
                  {skill.value} · {skill.trained ? 'Trained' : 'Base'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <h3>Weapon Skills</h3>
        <div className="summary-grid">
          {previewSkills.weaponSkills.map((skill) => (
            <div key={skill.id} className="summary-card">
              <strong>{skill.name}</strong>
              <div className="summary-list">
                <span>{skill.name_sv}</span>
                <span>
                  {skill.value} · {skill.trained ? 'Trained' : 'Base'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Save Character</h2>
        {error ? <p className="help-text">{error}</p> : null}
        <button className="button" type="button" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save character'}
        </button>
      </section>
    </div>
  );
}
