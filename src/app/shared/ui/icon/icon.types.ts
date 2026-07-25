export type IconName =
  | 'logo'
  | 'plus'
  | 'search'
  | 'home'
  | 'file'
  | 'cap'
  | 'star'
  | 'archive'
  | 'settings'
  | 'sparkles'
  | 'bell'
  | 'check'
  | 'checkmark'
  | 'chevron-right'
  | 'arrow-right'
  | 'grid'
  | 'list'
  | 'trash'
  | 'pin'
  | 'folder'
  | 'focus'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'x';

export type IconShape =
  | { readonly kind: 'path'; readonly d: string }
  | { readonly kind: 'circle'; readonly cx: number; readonly cy: number; readonly r: number }
  | {
      readonly kind: 'rect';
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
      readonly rx?: number;
    };

// Path data reverse-engineered verbatim from the design's `ICONS` dictionary (Memora.dc.html)
// so every icon matches the source pixel-for-pixel.
export const ICONS: Record<IconName, IconShape[]> = {
  logo: [{ kind: 'path', d: 'M15 8a5 5 0 1 0 0 8' }],
  plus: [{ kind: 'path', d: 'M12 5v14M5 12h14' }],
  search: [
    { kind: 'circle', cx: 11, cy: 11, r: 8 },
    { kind: 'path', d: 'm21 21-4.35-4.35' },
  ],
  home: [
    { kind: 'path', d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { kind: 'path', d: 'M9 22V12h6v10' },
  ],
  file: [
    { kind: 'path', d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
    { kind: 'path', d: 'M14 2v6h6' },
    { kind: 'path', d: 'M16 13H8' },
    { kind: 'path', d: 'M16 17H8' },
    { kind: 'path', d: 'M10 9H8' },
  ],
  cap: [
    { kind: 'path', d: 'M22 10 12 5 2 10l10 5 10-5z' },
    { kind: 'path', d: 'M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5' },
  ],
  star: [{ kind: 'path', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z' }],
  check: [
    { kind: 'path', d: 'M9 11l3 3L22 4' },
    { kind: 'path', d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  ],
  archive: [
    { kind: 'rect', x: 3, y: 4, width: 18, height: 4, rx: 1 },
    { kind: 'path', d: 'M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8' },
    { kind: 'path', d: 'M10 12h4' },
  ],
  settings: [
    { kind: 'circle', cx: 12, cy: 12, r: 3 },
    {
      kind: 'path',
      d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    },
  ],
  sparkles: [{ kind: 'path', d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z' }],
  bell: [
    { kind: 'path', d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' },
    { kind: 'path', d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' },
  ],
  'chevron-right': [{ kind: 'path', d: 'm9 18 6-6-6-6' }],
  'arrow-right': [{ kind: 'path', d: 'M5 12h14M12 5l7 7-7 7' }],
  grid: [
    { kind: 'rect', x: 3, y: 3, width: 7, height: 7, rx: 1 },
    { kind: 'rect', x: 14, y: 3, width: 7, height: 7, rx: 1 },
    { kind: 'rect', x: 3, y: 14, width: 7, height: 7, rx: 1 },
    { kind: 'rect', x: 14, y: 14, width: 7, height: 7, rx: 1 },
  ],
  list: [{ kind: 'path', d: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' }],
  trash: [
    { kind: 'path', d: 'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6M10 11v6M14 11v6' },
  ],
  x: [{ kind: 'path', d: 'M18 6 6 18M6 6l12 12' }],
  pin: [
    { kind: 'path', d: 'M12 17v5' },
    { kind: 'path', d: 'M9 10.8V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6.8l2 3.2H7z' },
  ],
  checkmark: [{ kind: 'path', d: 'M20 6 9 17l-5-5' }],
  sun: [
    { kind: 'circle', cx: 12, cy: 12, r: 4 },
    {
      kind: 'path',
      d: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    },
  ],
  moon: [{ kind: 'path', d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }],
  menu: [{ kind: 'path', d: 'M3 12h18M3 6h18M3 18h18' }],
  folder: [{ kind: 'path', d: 'M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z' }],
  focus: [
    { kind: 'path', d: 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3' },
  ],
};
