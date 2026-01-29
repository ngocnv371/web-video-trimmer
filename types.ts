
export interface VideoFile {
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
}

export interface TrimRange {
  start: number;
  end: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  EDITING = 'EDITING',
  EXPORTING = 'EXPORTING',
  FINISHED = 'FINISHED'
}

export type OutputFormat = 'video/webm;codecs=vp9' | 'video/webm;codecs=vp8';
