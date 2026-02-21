import corebookRules from '../../../source_data/reference-data/corebook-rules.json';
import corebookSkills from '../../../source_data/reference-data/corebook-skills.json';
import corebookProfessions from '../../../source_data/reference-data/corebook-professions.json';
import corebookKins from '../../../source_data/reference-data/corebook-kins.json';

export type DragonbaneAgeCategory = {
  id: string;
  name: 'Young' | 'Middle-Aged' | 'Old';
  trained_skills_total: number;
  trained_skills_from_profession: number;
  trained_skills_free_choice: number;
};

export type DragonbaneRulesData = {
  age: {
    categories: DragonbaneAgeCategory[];
  };
  derived_ratings: {
    movement: {
      base_by_kin: Record<string, number>;
      agl_modifiers: Array<{ agl_range: number[]; modifier: number }>;
    };
    damage_bonus: {
      brackets: Array<{ range: number[]; bonus: string | null }>;
    };
  };
};

export type DragonbaneSkillsData = {
  skill_base_chance: {
    brackets: Array<{ attribute_range: number[]; base_chance: number }>;
  };
  skills: {
    base_skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>;
    weapon_skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>;
    secondary_skills: Array<{ id: string; name: string; name_sv: string; attribute: string }>;
  };
};

export type DragonbaneProfession = {
  id: string;
  name: string;
  name_sv: string;
  skills: Array<{ id: string; name: string; name_sv: string }>;
};

export type DragonbaneProfessionsData = {
  professions: DragonbaneProfession[];
};

export type DragonbaneKin = {
  id: string;
  name: string;
  name_sv: string;
  movement: number;
};

export type DragonbaneKinsData = {
  kins: DragonbaneKin[];
};

export const dragonbaneRules = corebookRules as unknown as DragonbaneRulesData;
export const dragonbaneSkills = corebookSkills as unknown as DragonbaneSkillsData;
export const dragonbaneProfessions = corebookProfessions as DragonbaneProfessionsData;
export const dragonbaneKins = corebookKins as DragonbaneKinsData;
