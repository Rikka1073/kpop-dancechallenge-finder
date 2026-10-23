export type OfficialGuessInput = {
  title: string;
  channelTitle: string;
  suggestedGroups: string[];
};

export type ChallengeGuess = {
  include: boolean;
  officialGuess: boolean;
  officialGuessReason: string;
};

const CHALLENGE_HINT = /challenge|챌린지|안무/i;
const EXCLUDE_HINT =
  /vlog|behind[\s-]?the[\s-]?scenes|making[\s-]?of|making film|interview|dome moments|\bconcert\b|multi-?cam|dance practice|performance video|challenge teasing|\bteasing\b|ready\s?to\s?wear|chanel\s?show/i;

function includesGroup(text: string, groups: string[]): boolean {
  const haystack = text.toLowerCase();
  return groups.some((group) => haystack.includes(group.toLowerCase()));
}

export function guessChallenge(input: OfficialGuessInput): ChallengeGuess {
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
