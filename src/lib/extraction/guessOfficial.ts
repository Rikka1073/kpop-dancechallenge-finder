export type OfficialGuessInput = {
  title: string;
  channelTitle: string;
  suggestedGroups: string[];
};

const CHALLENGE_HINT = /challenge|챌린지|안무|dance/i;
const OFFICIAL_HINT = /official|공식/i;

function includesGroup(text: string, groups: string[]): boolean {
  const haystack = text.toLowerCase();
  return groups.some((group) => haystack.includes(group.toLowerCase()));
}

export function guessOfficial(input: OfficialGuessInput): {
  officialGuess: boolean;
  officialGuessReason: string;
} {
  const channelMatchesGroup = includesGroup(input.channelTitle, input.suggestedGroups);
  const titleLooksLikeChallenge = CHALLENGE_HINT.test(input.title);
  const titleLooksOfficial = OFFICIAL_HINT.test(input.title) || OFFICIAL_HINT.test(input.channelTitle);

  if (channelMatchesGroup && titleLooksLikeChallenge) {
    return {
      officialGuess: true,
      officialGuessReason: "チャンネル名がグループと一致し、タイトルがチャレンジに見える。確定ではない。",
    };
  }

  if (titleLooksOfficial && titleLooksLikeChallenge) {
    return {
      officialGuess: true,
      officialGuessReason: "タイトルまたはチャンネルに公式とチャレンジがある。確定ではない。",
    };
  }

  return {
    officialGuess: false,
    officialGuessReason: "公式かどうかはタイトルとチャンネルだけでは判断できない。",
  };
}
