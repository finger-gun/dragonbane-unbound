'use client';

import { useEffect, useMemo, useState } from 'react';

import type { CharacterPortrait } from '@dbu/types';

import { getSupabaseClient } from '../../lib/supabaseClient';

const urlCache = new Map<string, string>();

type PortraitImageProps = {
  portrait?: CharacterPortrait | null;
  alt: string;
  size?: number;
};

const placeholderForAlt = (alt: string) => {
  const trimmed = alt.trim();
  if (!trimmed) return '?';
  return trimmed[0]?.toUpperCase() ?? '?';
};

export default function PortraitImage({ portrait, alt, size = 56 }: PortraitImageProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const ref = useMemo(() => {
    if (!portrait) return null;
    if (portrait.kind === 'kin') return portrait.kin_ref;
    return null;
  }, [portrait]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!ref) {
        setUrl(null);
        return;
      }

      const cached = urlCache.get(ref);
      if (cached) {
        setUrl(cached);
        return;
      }

      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('missing_token');

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
        const response = await fetch(
          `${apiUrl}/packs/portraits/kins?ref=${encodeURIComponent(ref)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error('portrait_fetch_failed');

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        urlCache.set(ref, objectUrl);

        if (active) {
          setUrl(objectUrl);
          setFailed(false);
        }
      } catch {
        if (active) {
          setUrl(null);
          setFailed(true);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [ref]);

  if (!url) {
    const letter = placeholderForAlt(alt);
    return (
      <div
        aria-label={alt}
        title={alt}
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          background: failed
            ? 'linear-gradient(135deg, rgba(196, 90, 59, 0.18), rgba(17, 19, 24, 0.04))'
            : 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(17, 19, 24, 0.12)',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 700,
          color: 'rgba(17, 19, 24, 0.65)',
        }}
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        objectFit: 'cover',
        border: '1px solid rgba(17, 19, 24, 0.12)',
        background: 'rgba(255,255,255,0.85)',
      }}
    />
  );
}
