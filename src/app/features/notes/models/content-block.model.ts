export interface TextRun {
  readonly text: string;
  readonly bold?: boolean;
  readonly emphasis?: boolean;
  readonly link?: string;
}

export interface ChecklistItem {
  readonly id: string;
  readonly text: string;
  readonly done: boolean;
}

export type ContentBlock =
  | { readonly id: string; readonly type: 'paragraph'; readonly runs: TextRun[] }
  | { readonly id: string; readonly type: 'heading'; readonly level: 2 | 3; readonly text: string }
  | { readonly id: string; readonly type: 'blockquote'; readonly text: string }
  | { readonly id: string; readonly type: 'checklist'; readonly items: ChecklistItem[] }
  | {
      readonly id: string;
      readonly type: 'table';
      readonly headers: string[];
      readonly rows: string[][];
    }
  | {
      readonly id: string;
      readonly type: 'code';
      readonly language?: string;
      readonly code: string;
    };
