import { MediaFile } from "@/lib/cms-types";

export function isValidMediaFile(file: Partial<MediaFile>): file is MediaFile {
  return (
    typeof file.id === 'string' &&
    typeof file.type === 'string' &&
    typeof file.url === 'string' &&
    typeof file.filename === 'string' &&
    typeof file.mimeType === 'string' &&
    typeof file.size === 'number'
  );
}

export function ensureMediaFiles(files: Partial<MediaFile>[] | undefined): MediaFile[] {
  if (!files) return [];
  return files.filter(isValidMediaFile);
}