import type {
  AttributeId,
  CharacterAttributes,
  CharacterSheet,
  DerivedRatings,
  RulesEvaluationResult,
  Ruleset,
  SkillEntry,
} from '@dbu/types';

import {
  dragonbaneKins,
  dragonbaneProfessions,
  dragonbaneRules,
  dragonbaneSkills,
} from './dragonbaneData.js';
import { evaluateRuleset } from './rulesDsl.js';

export type CharacterCreationInput = {
  playerName?: string | null;
  characterName: string;
  kinId: string;
  age: 'Young' | 'Middle-Aged' | 'Old';
  professionId: string;
  weakness?: string | null;
  appearance?: string | null;
  attributes: CharacterAttributes;
  trainedSkillIds: string[];
};

export const getKinById = (kinId: string) =>
  dragonbaneKins.kins.find((kin) => kin.id === kinId) ?? null;

export const getProfessionById = (professionId: string) =>
  dragonbaneProfessions.professions.find((profession) => profession.id === professionId) ?? null;

export const getAgeSkillSlots = (age: CharacterCreationInput['age']) => {
  const category = dragonbaneRules.age.categories.find((item) => item.name === age);
  if (!category) {
    return {
      total: 0,
      fromProfession: 0,
      freeChoice: 0,
    };
  }

  return {
    total: category.trained_skills_total,
    fromProfession: category.trained_skills_from_profession,
    freeChoice: category.trained_skills_free_choice,
  };
};

const getBaseChance = (value: number) => {
  const bracket = dragonbaneSkills.skill_base_chance.brackets.find(
    (entry) => value >= entry.attribute_range[0] && value <= entry.attribute_range[1]
  );
  return bracket?.base_chance ?? 3;
};

const buildSkillEntries = (
  skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>,
  attributes: CharacterAttributes,
  trainedSkillIds: string[]
): SkillEntry[] =>
  skills.map((skill) => {
    const attributeValue = attributes[skill.attribute as keyof CharacterAttributes] ?? 3;
    const baseChance = getBaseChance(attributeValue);
    const trained = trainedSkillIds.includes(skill.id);
    const value = trained ? baseChance * 2 : baseChance;

    return {
      id: skill.id,
      name: skill.name,
      name_sv: skill.name_sv,
      linked_attribute: skill.attribute as AttributeId,
      value,
      trained,
      improvement_mark: false,
    };
  });

export const buildCharacterSkills = (
  attributes: CharacterAttributes,
  trainedSkillIds: string[]
) => {
  const baseSkills = buildSkillEntries(dragonbaneSkills.skills.base_skills, attributes, trainedSkillIds);
  const weaponSkills = buildSkillEntries(
    dragonbaneSkills.skills.weapon_skills,
    attributes,
    trainedSkillIds
  );

  return {
    skills: baseSkills,
    weaponSkills,
  };
};

const buildDerivedRuleset = () => {
  const movementMap = Object.fromEntries(
    dragonbaneKins.kins.map((kin) => [kin.id, kin.movement])
  );
  const aglRanges = dragonbaneRules.derived_ratings.movement.agl_modifiers.map((entry) => ({
    min: entry.agl_range[0],
    max: entry.agl_range[1],
    result: entry.modifier,
  }));
  const damageRanges = dragonbaneRules.derived_ratings.damage_bonus.brackets.map((entry) => ({
    min: entry.range[0],
    max: entry.range[1],
    result: entry.bonus,
  }));

  const ruleset: Ruleset = {
    id: 'dragonbane-derived',
    name: 'Dragonbane Derived Stats',
    rules: [
      {
        id: 'damage_bonus_str',
        output: 'damage_bonus_str',
        expression: {
          type: 'rangeLookup',
          value: { type: 'attr', key: 'STR' },
          ranges: damageRanges,
        },
      },
      {
        id: 'damage_bonus_agl',
        output: 'damage_bonus_agl',
        expression: {
          type: 'rangeLookup',
          value: { type: 'attr', key: 'AGL' },
          ranges: damageRanges,
        },
      },
      {
        id: 'movement',
        output: 'movement',
        expression: {
          type: 'add',
          items: [
            { type: 'mapLookup', key: { type: 'attr', key: 'kin_id' }, map: movementMap },
            { type: 'rangeLookup', value: { type: 'attr', key: 'AGL' }, ranges: aglRanges },
          ],
        },
      },
      {
        id: 'carrying_capacity',
        output: 'carrying_capacity',
        expression: {
          type: 'ceil',
          value: {
            type: 'div',
            numerator: { type: 'attr', key: 'STR' },
            denominator: { type: 'const', value: 2 },
          },
        },
      },
      {
        id: 'max_hp',
        output: 'max_hp',
        expression: { type: 'attr', key: 'CON' },
      },
      {
        id: 'max_wp',
        output: 'max_wp',
        expression: { type: 'attr', key: 'WIL' },
      },
    ],
  };

  return ruleset;
};

export const computeDerivedRatings = (
  attributes: CharacterAttributes,
  kinId: string
): { derived: DerivedRatings; receipt: RulesEvaluationResult } => {
  const ruleset = buildDerivedRuleset();
  const receipt = evaluateRuleset(ruleset, {
    ...attributes,
    kin_id: kinId,
  });

  return {
    derived: {
      damage_bonus_str: receipt.outputs.damage_bonus_str as string | null,
      damage_bonus_agl: receipt.outputs.damage_bonus_agl as string | null,
      movement: Number(receipt.outputs.movement ?? 0),
      carrying_capacity: Number(receipt.outputs.carrying_capacity ?? 0),
    },
    receipt,
  };
};

export const buildCharacterSheet = (input: CharacterCreationInput): CharacterSheet => {
  const kin = getKinById(input.kinId);
  const profession = getProfessionById(input.professionId);

  if (!kin) {
    throw new Error(`Unknown kin: ${input.kinId}`);
  }

  if (!profession) {
    throw new Error(`Unknown profession: ${input.professionId}`);
  }

  const { total } = getAgeSkillSlots(input.age);
  const professionSkillIds = profession.skills.map((skill) => skill.id);
  const professionTrainedCount = input.trainedSkillIds.filter((skillId) =>
    professionSkillIds.includes(skillId)
  ).length;

  const { fromProfession } = getAgeSkillSlots(input.age);

  if (professionTrainedCount !== fromProfession) {
    throw new Error(`Trained skills must include ${fromProfession} profession skills.`);
  }

  if (input.trainedSkillIds.length !== total) {
    throw new Error(`Trained skill count must be ${total}.`);
  }

  const { derived, receipt } = computeDerivedRatings(input.attributes, input.kinId);
  const skills = buildCharacterSkills(input.attributes, input.trainedSkillIds);

  return {
    header: {
      player_name: input.playerName ?? null,
      character_name: input.characterName,
      kin: kin.name,
      kin_id: kin.id,
      age: input.age,
      profession: profession.name,
      profession_id: profession.id,
      weakness: input.weakness ?? null,
      appearance: input.appearance ?? null,
      nickname: null,
    },
    attributes: input.attributes,
    conditions: {
      exhausted: false,
      sickly: false,
      dazed: false,
      angry: false,
      scared: false,
      disheartened: false,
    },
    derived_ratings: derived,
    skills: skills.skills,
    weapon_skills: skills.weaponSkills,
    secondary_skills: [],
    heroic_abilities_and_spells: [],
    weapons: [],
    armor: {
      body_armor: null,
      helmet: null,
    },
    packing: [],
    currency: { gold: 0, silver: 0, copper: 0 },
    rest: { quick_rest_used: false, short_rest_used: false },
    hit_points: {
      max: Number(receipt.outputs.max_hp ?? input.attributes.CON),
      current: Number(receipt.outputs.max_hp ?? input.attributes.CON),
    },
    willpower_points: {
      max: Number(receipt.outputs.max_wp ?? input.attributes.WIL),
      current: Number(receipt.outputs.max_wp ?? input.attributes.WIL),
    },
    death_saves: { successes: 0, failures: 0 },
    memento: null,
    trinkets: [],
  };
};
