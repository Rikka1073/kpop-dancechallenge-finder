export type VideoTagRow = {
  video_id: string;
  tag_id: string;
};

export function videoIdsMatchingAll(rows: VideoTagRow[], requiredIds: string[]): string[] {
  if (requiredIds.length === 0) {
    return [...new Set(rows.map((row) => row.video_id))];
  }

  const tagsByVideo = new Map<string, Set<string>>();
  for (const row of rows) {
    const tags = tagsByVideo.get(row.video_id) ?? new Set<string>();
    tags.add(row.tag_id);
    tagsByVideo.set(row.video_id, tags);
  }

  return [...tagsByVideo.entries()]
    .filter(([, tags]) => requiredIds.every((id) => tags.has(id)))
    .map(([videoId]) => videoId);
}

export function intersectVideoIds(left: string[] | null, right: string[] | null): string[] | null {
  if (left === null) {
    return right;
  }
  if (right === null) {
    return left;
  }
  const rightSet = new Set(right);
  return left.filter((id) => rightSet.has(id));
}
