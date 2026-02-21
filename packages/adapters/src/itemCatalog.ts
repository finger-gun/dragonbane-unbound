import { promises as fs } from 'fs';
import path from 'path';

import type {
  LocalPack,
  PackItemCatalogEntry,
  PackItemKind,
  PackValidationError,
} from '@dbu/types';

import { loadLocalPacks } from './packLoader.js';

type RawPackItem = {
  id: string;
  kind: PackItemKind;
  name: string;
  name_sv?: string | null;
  description?: string | null;
  damage?: string | null;
  protection?: number | null;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const normalizeItemsJson = (value: unknown): RawPackItem[] | null => {
  if (Array.isArray(value)) return value as RawPackItem[];
  if (isObject(value) && Array.isArray(value.items)) return value.items as RawPackItem[];
  return null;
};

const isPackItemKind = (value: unknown): value is PackItemKind =>
  value === 'item' || value === 'weapon' || value === 'armor';

const parsePackItem = (value: unknown): RawPackItem | null => {
  if (!isObject(value)) return null;
  if (typeof value.id !== 'string' || !value.id) return null;
  if (typeof value.name !== 'string' || !value.name) return null;
  if (!isPackItemKind(value.kind)) return null;

  const kind = value.kind;
  const damage = typeof value.damage === 'string' ? value.damage : null;
  const protection = typeof value.protection === 'number' ? value.protection : null;
  if (kind === 'weapon' && !damage) return null;
  if (kind === 'armor' && (protection === null || Number.isNaN(protection))) return null;

  return {
    id: value.id,
    kind,
    name: value.name,
    name_sv: typeof value.name_sv === 'string' ? value.name_sv : null,
    description: typeof value.description === 'string' ? value.description : null,
    damage,
    protection,
  };
};

export const loadLocalPackItems = async (
  rootDir: string,
): Promise<{
  packs: LocalPack[];
  items: PackItemCatalogEntry[];
  errors: PackValidationError[];
}> => {
  const { packs, errors } = await loadLocalPacks(rootDir);
  const items: PackItemCatalogEntry[] = [];

  await Promise.all(
    packs.map(async (pack) => {
      const itemsPath = path.join(pack.directory, 'items.json');
      try {
        const content = await fs.readFile(itemsPath, 'utf-8');
        const json = JSON.parse(content) as unknown;
        const raw = normalizeItemsJson(json);
        if (!raw) {
          errors.push({
            message: `Invalid items.json format (${pack.metadata.id})`,
            path: itemsPath,
          });
          return;
        }

        raw.forEach((entry, index) => {
          const parsed = parsePackItem(entry);
          if (!parsed) {
            errors.push({
              message: `Invalid item entry at index ${index} (${pack.metadata.id})`,
              path: `${itemsPath}#/${index}`,
            });
            return;
          }

          items.push({
            id: `${pack.metadata.id}:${parsed.id}`,
            pack_id: pack.metadata.id,
            item_id: parsed.id,
            kind: parsed.kind,
            name: parsed.name,
            name_sv: parsed.name_sv ?? null,
            description: parsed.description ?? null,
            damage: parsed.damage ?? null,
            protection: parsed.protection ?? null,
          });
        });
      } catch (error) {
        // Missing items.json is OK.
        if (
          error instanceof Error &&
          'code' in error &&
          (error as NodeJS.ErrnoException).code === 'ENOENT'
        ) {
          return;
        }

        errors.push({
          message: `Failed to load items.json (${pack.metadata.id}): ${error instanceof Error ? error.message : 'unknown error'}`,
          path: itemsPath,
        });
      }
    }),
  );

  return { packs, items, errors };
};
