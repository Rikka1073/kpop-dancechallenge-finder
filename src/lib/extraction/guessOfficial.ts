export type OfficialGuessInput = {
  title: string;
  channelTitle: string;
  suggestedGroups: string[];
  catalogGroups?: string[];
  catalogSongs?: string[];
};

export type ChallengeGuessOptions = {
  requireChallengeHint?: boolean;
};

export type ChallengeGuess = {
  include: boolean;
  officialGuess: boolean;
  officialGuessReason: string;
};

const CHALLENGE_HINT = /challenge|챌린지|안무/i;
const DANCE_HINT = /\bdance\b|댄스|ダンス|choreo|choreography|춤추|춤을|춤기|따라해|따라하/i;
const COLLAB_HINT = /선배님|\bw\/|\bdc\s*[:.]|\bdc\s+by\b/i;
const MENTION_HINT = /(?<!@)@(?!@)[^\s#]+/;
const EXCLUDE_HINT =
  /vlog|behind[\s-]?the[\s-]?scenes|making[\s-]?of|making film|interview|dome moments|\bconcert\b|multi-?cam|dance practice|performance video|challenge teasing|\bteasing\b|\bteaser\b|ready\s?to\s?wear|chanel\s?show|#whatsinmydrafts|create (a )?short with/i;
const SKIP_CAMPAIGN_SUFFIX = /^(fanmeeting|teaser|behind|vlog|making|shorts|fyp)$/i;

function includesGroup(text: string, groups: string[]): boolean {
  const haystack = text.toLowerCase();
  return groups.some((group) => haystack.includes(group.toLowerCase()));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compactAlnum(value: string): string {
  return value.replace(/[^a-zA-Z0-9가-힣ぁ-んァ-ン一-龯]+/g, "").toLowerCase();
}

function titleMentionsGroup(title: string, groupName: string): boolean {
  const name = groupName.trim();
  if (!name) {
    return false;
  }
  return new RegExp(`(?:^|[#@\\s])${escapeRegExp(name)}(?:$|[#@\\s_])`, "i").test(title);
}

function hasOtherCatalogGroup(title: string, suggestedGroups: string[], catalogGroups: string[]): boolean {
  const own = new Set(suggestedGroups.map((group) => group.trim().toLowerCase()).filter(Boolean));
  return catalogGroups.some((group) => {
    const name = group.trim();
    if (!name || own.has(name.toLowerCase())) {
      return false;
    }
    return titleMentionsGroup(title, name);
  });
}

function titleHashtags(title: string): string[] {
  return [...title.matchAll(/#([^\s#]+)/g)].map((match) => compactAlnum(match[1])).filter(Boolean);
}

export function titleMentionsSong(title: string, songName: string): boolean {
  const name = songName.trim();
  if (!name) {
    return false;
  }

  const compact = compactAlnum(name);
  if (compact.length < 4) {
    return false;
  }

  if (titleHashtags(title).some((tag) => tag === compact || tag.endsWith(compact))) {
    return true;
  }

  if (/\s/.test(name)) {
    return new RegExp(`(?:^|[\\s#])${escapeRegExp(name)}(?:$|[\\s#])`, "i").test(title);
  }

  return false;
}

function hasCatalogSong(title: string, catalogSongs: string[]): boolean {
  return catalogSongs.some((song) => titleMentionsSong(title, song));
}

function hasGroupSongHashtag(title: string, groups: string[]): boolean {
  const tags = titleHashtags(title);
  return groups.some((group) => {
    const compactGroup = compactAlnum(group);
    if (compactGroup.length < 3) {
      return false;
    }
    return tags.some((tag) => {
      if (!tag.startsWith(compactGroup) || tag.length <= compactGroup.length) {
        return false;
      }
      const suffix = tag.slice(compactGroup.length);
      return suffix.length >= 3 && !SKIP_CAMPAIGN_SUFFIX.test(suffix);
    });
  });
}

export function hasChallengeHint(input: OfficialGuessInput): boolean {
  if (CHALLENGE_HINT.test(input.title) || DANCE_HINT.test(input.title) || COLLAB_HINT.test(input.title) || MENTION_HINT.test(input.title)) {
    return true;
  }
  if (hasCatalogSong(input.title, input.catalogSongs ?? [])) {
    return true;
  }
  if (hasGroupSongHashtag(input.title, input.suggestedGroups)) {
    return true;
  }
  return hasOtherCatalogGroup(input.title, input.suggestedGroups, input.catalogGroups ?? []);
}

export function guessChallenge(input: OfficialGuessInput, options?: ChallengeGuessOptions): ChallengeGuess {
  if (EXCLUDE_HINT.test(input.title)) {
    return {
      include: false,
      officialGuess: false,
      officialGuessReason: "タイトルがダンスチャレンジ以外に見えるので抽出しない。",
    };
  }

  if (CHALLENGE_HINT.test(input.title)) {
    const channelMatchesGroup = includesGroup(input.channelTitle, input.suggestedGroups);
    return {
      include: true,
      officialGuess: true,
      officialGuessReason: channelMatchesGroup
        ? "チャンネル名がグループと一致し、タイトルがチャレンジに見える。確定ではない。"
        : "タイトルがチャレンジに見える。確定ではない。",
    };
  }

  if (options?.requireChallengeHint && !hasChallengeHint(input)) {
    return {
      include: false,
      officialGuess: false,
      officialGuessReason: "タイトルに曲名やコラボの手がかりが無いので抽出しない。",
    };
  }

  if (options?.requireChallengeHint) {
    return {
      include: true,
      officialGuess: false,
      officialGuessReason: "タイトルに曲名やコラボの手がかりがある。確定ではない。",
    };
  }

  return {
    include: true,
    officialGuess: false,
    officialGuessReason: "タイトルだけではダンスチャレンジか判断できない。人が判定する。",
  };
}

export function guessOfficial(input: OfficialGuessInput): {
  officialGuess: boolean;
  officialGuessReason: string;
} {
  const guess = guessChallenge(input);
  return {
    officialGuess: guess.officialGuess,
    officialGuessReason: guess.officialGuessReason,
  };
}
