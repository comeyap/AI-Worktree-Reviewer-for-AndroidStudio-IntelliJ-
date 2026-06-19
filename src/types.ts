export interface ChangedFile {
  filename: string;
  filepath: string;
  language: string;
  originalContent: string;
  modifiedContent: string;
  addedLinesCount: number;
  deletedLinesCount: number;
}

export interface Worktree {
  id: string;
  name: string; // folder name
  branch: string;
  path: string;
  modifiedCount: number;
  addedLines: number;
  deletedLines: number;
  files: ChangedFile[];
}

export type ThemeType = 'darcula' | 'light';

export interface AppSettings {
  refreshInterval: 'off' | '5s' | '10s';
  theme: ThemeType;
}
