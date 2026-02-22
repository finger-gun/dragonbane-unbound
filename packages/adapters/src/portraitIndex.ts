import { promises as fs } from 'fs';
import path from 'path';

import type { ContentRef, LocalPack, PackValidationError } from '@dbu/types';

import { loadLocalPacks } from './packLoader.js';

export const PACK_PORTRAIT_INDEX_FILE = path.join('assets', 'portraits', 'index.json');
export const PACK_KIN_PORTRAIT_DIR = path.join('assets', 'portraits', 'kins');

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isSafeRelativePath = (value: string) => {
  if (!value) return false;
  if (path.isAbsolute(value)) return false;
  const normalized = path.normalize(value);
  if (normalized.startsWith('..') || normalized.includes(`..${path.sep}`)) return false;
  return true;
};

const parseContentRef = (value: string): { packId: string; localId: string } | null => {
  const idx = value.indexOf(':');
  if (idx <= 0) return null;
  const packId = value.slice(0, idx).trim();
  const localId = value.slice(idx + 1).trim();
  if (!packId || !localId) return null;
  return { packId, localId };
};

export const loadPackPortraitIndex = async (
  pack: LocalPack,
): Promise<{
  kins: Record<string, string>;
  errors: PackValidationError[];
}> => {
  const errors: PackValidationError[] = [];
  const indexPath = path.join(pack.directory, PACK_PORTRAIT_INDEX_FILE);
  try {
    const content = await fs.readFile(indexPath, 'utf-8');
    const json = JSON.parse(content) as unknown;
    if (!isObject(json)) {
      return {
        kins: {},
        errors: [
          { message: `Invalid portrait index format (${pack.metadata.id})`, path: indexPath },
        ],
      };
    }

    const rawKins = (json as any).kins;
    if (rawKins === undefined) {
      return { kins: {}, errors: [] };
    }
    if (!isObject(rawKins)) {
      return {
        kins: {},
        errors: [
          {
            message: `Invalid portrait index kins map (${pack.metadata.id})`,
            path: `${indexPath}#/kins`,
          },
        ],
      };
    }

    const kins: Record<string, string> = {};
    Object.entries(rawKins).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        errors.push({
          message: `Invalid portrait index value for ${key} (${pack.metadata.id})`,
          path: `${indexPath}#/kins/${key}`,
        });
        return;
      }

      const parsed = parseContentRef(key);
      if (!parsed) {
        errors.push({
          message: `Invalid content ref key for portrait index: ${key} (${pack.metadata.id})`,
          path: `${indexPath}#/kins/${key}`,
        });
        return;
      }

      if (
        !isSafeRelativePath(value) ||
        (!value.startsWith(`assets${path.sep}`) && !value.startsWith('assets/'))
      ) {
        errors.push({
          message: `Invalid portrait path for ${key} (${pack.metadata.id})`,
          path: `${indexPath}#/kins/${key}`,
        });
        return;
      }

      kins[key] = value;
    });

    return { kins, errors };
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return { kins: {}, errors: [] };
    }

    return {
      kins: {},
      errors: [
        {
          message: `Failed to load portrait index (${pack.metadata.id}): ${error instanceof Error ? error.message : 'unknown error'}`,
          path: indexPath,
        },
      ],
    };
  }
};

export const resolveKinPortraitAsset = async (
  rootDir: string,
  kinRef: ContentRef,
): Promise<
  | { pack: LocalPack; assetPath: string; errors: PackValidationError[] }
  | { pack: null; assetPath: null; errors: PackValidationError[] }
> => {
  const parsed = parseContentRef(kinRef);
  if (!parsed) {
    return {
      pack: null,
      assetPath: null,
      errors: [{ message: `Invalid kin reference: ${kinRef}`, path: 'kin_ref' }],
    };
  }

  const { packs, errors } = await loadLocalPacks(rootDir);
  const pack = packs.find((p) => p.metadata.id === parsed.packId) ?? null;
  if (!pack) {
    return {
      pack: null,
      assetPath: null,
      errors: [...errors, { message: `Pack not found: ${parsed.packId}`, path: 'pack_id' }],
    };
  }

  const index = await loadPackPortraitIndex(pack);
  const indexErrors = index.errors;

  const mapped = index.kins[kinRef];
  if (mapped) {
    return { pack, assetPath: mapped, errors: [...errors, ...indexErrors] };
  }

  const fallback = path.join(PACK_KIN_PORTRAIT_DIR, `${parsed.localId}.png`);
  return { pack, assetPath: fallback, errors: [...errors, ...indexErrors] };
};
