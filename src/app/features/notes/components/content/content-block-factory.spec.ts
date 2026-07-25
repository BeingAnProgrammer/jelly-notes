import { createEmptyBlock } from './content-block-factory';

describe('createEmptyBlock', () => {
  it('creates each block type with a unique id and sensible empty defaults', () => {
    const paragraph = createEmptyBlock('paragraph');
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.type === 'paragraph' && paragraph.runs).toEqual([{ text: '' }]);

    const heading = createEmptyBlock('heading');
    expect(heading.type === 'heading' && heading.level).toBe(2);

    const checklist = createEmptyBlock('checklist');
    expect(checklist.type === 'checklist' && checklist.items).toEqual([]);

    const table = createEmptyBlock('table');
    expect(table.type === 'table' && table.headers.length).toBe(2);
    expect(table.type === 'table' && table.rows.length).toBe(2);

    const code = createEmptyBlock('code');
    expect(code.type === 'code' && code.code).toBe('');
  });

  it('gives every created block a distinct id', () => {
    const a = createEmptyBlock('paragraph');
    const b = createEmptyBlock('paragraph');
    expect(a.id).not.toBe(b.id);
  });
});
