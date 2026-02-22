export type AppInfo = {
  name: string;
  tagline: string;
  stage: 'alpha' | 'beta' | 'stable';
};

/** Canonical namespaced content reference: `${pack_id}:${local_id}` */
export type ContentRef = `${string}:${string}`;

export type KinRef = ContentRef;

export type CharacterPortrait = {
  kind: 'kin';
  kin_ref: KinRef;
};

export type AttributeId = 'STR' | 'CON' | 'AGL' | 'INT' | 'WIL' | 'CHA';

export type CharacterHeader = {
  player_name?: string | null;
  character_name: string;
  kin: string;
  kin_id?: string | null;
  age: 'Young' | 'Middle-Aged' | 'Old';
  profession: string;
  profession_id?: string | null;
  weakness?: string | null;
  appearance?: string | null;
  nickname?: string | null;
};

export type CharacterAttributes = Record<AttributeId, number>;

export type CharacterConditions = {
  exhausted: boolean;
  sickly: boolean;
  dazed: boolean;
  angry: boolean;
  scared: boolean;
  disheartened: boolean;
};

export type DerivedRatings = {
  damage_bonus_str: string | null;
  damage_bonus_agl: string | null;
  movement: number;
  carrying_capacity: number;
};

export type SkillEntry = {
  id: string;
  name?: string;
  name_sv?: string;
  linked_attribute?: AttributeId;
  value: number;
  trained?: boolean;
  improvement_mark: boolean;
};

export type HeroicAbilityEntry = {
  id?: string | null;
  name: string;
  name_sv?: string;
  type: 'heroic_ability' | 'kin_ability' | 'spell' | 'cantrip';
  wp_cost?: number | string | null;
  school?: 'General' | 'Animism' | 'Elementalism' | 'Mentalism' | null;
  spell_level?: number | null;
  prepared?: boolean | null;
};

export type WeaponEntry = {
  id?: string | null;
  pack_id?: string | null;
  item_id?: string | null;
  name: string;
  name_sv?: string | null;
  grip?: '1H' | '2H' | null;
  str_requirement?: number | null;
  range?: number | string | null;
  damage: string;
  durability?: number | null;
  durability_max?: number | null;
  properties?: string[];
  skill_id?: string | null;
  is_masterwork?: boolean;
};

export type ArmorEntry = {
  id?: string;
  pack_id?: string | null;
  item_id?: string | null;
  name: string;
  name_sv?: string;
  protection: number;
  disadvantages?: string[];
};

export type CharacterArmor = {
  body_armor: ArmorEntry | null;
  helmet: ArmorEntry | null;
};

export type PackingEntry = {
  slot: number;
  pack_id?: string | null;
  item_id?: string | null;
  item: string;
  item_sv?: string;
  weight?: number;
};

export type Currency = {
  gold: number;
  silver: number;
  copper: number;
};

export type RestTracking = {
  quick_rest_used: boolean;
  short_rest_used: boolean;
};

export type PointTrack = {
  max: number;
  current: number;
};

export type DeathSaves = {
  successes: number;
  failures: number;
};

export type CharacterSheet = {
  header: CharacterHeader;
  portrait?: CharacterPortrait | null;
  attributes: CharacterAttributes;
  conditions: CharacterConditions;
  derived_ratings: DerivedRatings;
  skills: SkillEntry[];
  weapon_skills: SkillEntry[];
  secondary_skills: SkillEntry[];
  heroic_abilities_and_spells: HeroicAbilityEntry[];
  weapons: WeaponEntry[];
  armor: CharacterArmor;
  packing: PackingEntry[];
  currency: Currency;
  rest: RestTracking;
  hit_points: PointTrack;
  willpower_points: PointTrack;
  death_saves: DeathSaves;
  memento?: string | null;
  trinkets?: string[];
};

export type CharacterRecord = {
  id: string;
  user_id: string;
  data: CharacterSheet;
  created_at?: string;
  updated_at?: string;
};

export type EncounterParticipant = {
  id: string;
  name: string;
  initiative: number;
  character_id?: string | null;
  is_player?: boolean;
  note?: string | null;
};

export type EncounterLogEntry = {
  id: string;
  timestamp: string;
  message: string;
  actor_id?: string | null;
};

export type Encounter = {
  id: string;
  user_id: string;
  adventure_id?: string | null;
  name: string;
  participants: EncounterParticipant[];
  turn_index: number;
  round: number;
  log: EncounterLogEntry[];
  created_at?: string;
  updated_at?: string;
};

export type PackMetadata = {
  id: string;
  name: string;
  version: string;
  description?: string | null;
  author?: string | null;
  tags?: string[];
  content_version?: string | null;
  systems?: string[];
  rulesets?: string[];
};

export type PackValidationError = {
  message: string;
  path: string;
};

export type LocalPack = {
  directory: string;
  metadata: PackMetadata;
};

export type PackItemKind = 'item' | 'weapon' | 'armor';

export type PackItemCatalogEntry = {
  /** Stable composite identifier, e.g. `${pack_id}:${item_id}` */
  id: string;
  pack_id: string;
  item_id: string;
  kind: PackItemKind;
  name: string;
  name_sv?: string | null;
  description?: string | null;
  damage?: string | null;
  protection?: number | null;
};

export type RulesValue = number | string | boolean | null;

export type RulesExpression =
  | { type: 'const'; value: RulesValue }
  | { type: 'attr'; key: string }
  | { type: 'add'; items: RulesExpression[] }
  | { type: 'mul'; items: RulesExpression[] }
  | { type: 'div'; numerator: RulesExpression; denominator: RulesExpression }
  | { type: 'ceil'; value: RulesExpression }
  | { type: 'floor'; value: RulesExpression }
  | { type: 'mapLookup'; key: RulesExpression; map: Record<string, RulesValue> }
  | {
      type: 'rangeLookup';
      value: RulesExpression;
      ranges: Array<{ min: number; max: number; result: RulesValue }>;
    };

export type RulesRule = {
  id: string;
  output: string;
  expression: RulesExpression;
};

export type Ruleset = {
  id: string;
  name: string;
  rules: RulesRule[];
};

export type RuleStep = {
  id: string;
  expression: RulesExpression;
  value: RulesValue;
};

export type RuleReceipt = {
  ruleId: string;
  output: string;
  inputs: Record<string, RulesValue>;
  steps: RuleStep[];
  result: RulesValue;
};

export type RulesEvaluationResult = {
  outputs: Record<string, RulesValue>;
  receipts: RuleReceipt[];
};
