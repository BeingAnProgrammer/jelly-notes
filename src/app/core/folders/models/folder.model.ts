export interface Folder {
  readonly name: string;
  readonly color: string;
}

export interface FolderWithCount extends Folder {
  readonly count: number;
}
