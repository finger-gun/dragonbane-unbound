import { promises as fs } from 'fs';
import path from 'path';

import type { LocalPack, PackMetadata, PackValidationError } from '@dbu/types';

export const packMetadataSchema = {
  required: ['id', 'name', 'version'],
  optional: ['description', 'author', 'tags', 'content_version', 'systems', 'rulesets'],
};

const toArray = (value: unknown) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map((item) => String(item));
  return [String(value)];
};

export const validatePackMetadata = (data: unknown): {
  metadata: PackMetadata | null;
  errors: PackValidationError[];
} => {
  const errors: PackValidationError[] = [];
  if (!data || typeof data !== 'object') {
    return {
      metadata: null,
      errors: [{ message: 'Metadata must be an object.', path: '' }],
    };
  }

  const record = data as Record<string, unknown>;
  packMetadataSchema.required.forEach((field) => {
    if (!record[field]) {
      errors.push({ message: `Missing required field: ${field}`, path: field });
    }
  });

  if (errors.length > 0) {
    return { metadata: null, errors };
  }

  const metadata: PackMetadata = {
    id: String(record.id),
    name: String(record.name),
    version: String(record.version),
    description: record.description ? String(record.description) : null,
    author: record.author ? String(record.author) : null,
    tags: toArray(record.tags),
    content_version: record.content_version ? String(record.content_version) : null,
    systems: toArray(record.systems),
    rulesets: toArray(record.rulesets),
  };

  return { metadata, errors: [] };
};

export const loadLocalPacks = async (rootDir: string) => {
  const packs: LocalPack[] = [];
  const errors: PackValidationError[] = [];

  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    await Promise.all(
      directories.map(async (dir: string) => {
        const packPath = path.join(rootDir, dir, 'pack.json');
        try {
          const content = await fs.readFile(packPath, 'utf-8');
          const json = JSON.parse(content) as unknown;
          const { metadata, errors: validationErrors } = validatePackMetadata(json);

          if (validationErrors.length > 0 || !metadata) {
            validationErrors.forEach((error) => {
              errors.push({ message: `${error.message} (${dir})`, path: error.path });
            });
            return;
          }

          packs.push({ directory: path.join(rootDir, dir), metadata });
        } catch (error) {
          errors.push({
            message: `Failed to load pack.json for ${dir}: ${error instanceof Error ? error.message : 'unknown error'}`,
            path: `/${dir}/pack.json`,
          });
        }
      })
    );
  } catch (error) {
    errors.push({
      message: `Failed to read packs directory: ${error instanceof Error ? error.message : 'unknown error'}`,
      path: rootDir,
    });
  }

  return { packs, errors };
};
