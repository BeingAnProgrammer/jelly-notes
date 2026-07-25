import { generateId } from '../../../../shared/utils/id';
import { ContentBlock } from '../../models/content-block.model';

export function createEmptyBlock(type: ContentBlock['type']): ContentBlock {
  const id = generateId();
  switch (type) {
    case 'paragraph':
      return { id, type, runs: [{ text: '' }] };
    case 'heading':
      return { id, type, level: 2, text: '' };
    case 'blockquote':
      return { id, type, text: '' };
    case 'checklist':
      return { id, type, items: [] };
    case 'table':
      return {
        id,
        type,
        headers: ['Column 1', 'Column 2'],
        rows: [
          ['', ''],
          ['', ''],
        ],
      };
    case 'code':
      return { id, type, code: '' };
  }
}
