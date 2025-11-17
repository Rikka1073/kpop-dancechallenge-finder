import { Check, Heart, Shield, X, Zap } from "lucide-react";

export const featureCards = [
  {
    id: 1,
    title: "ワンタップ検索",
    description: "複雑な検索キーワードは不要。グループ名をタップするだけで、関連するダンス動画が瞬時に表示されます。",
    icon: <Zap className="h-8 w-8 text-purple-600" />,
  },
  {
    id: 2,
    title: "厳選公式コラボ動画",
    description:
      "アイドル同士のダンスチャレンジのみを厳選収録。一般人の動画や宣伝動画は完全除外で、質の高いコンテンツだけをお届け。",
    icon: <Shield className="h-8 w-8 text-red-600" />,
  },
  {
    id: 3,
    title: "推し活サポート",
    description:
      "好きなグループの動画を一覧で管理。1タップで推しの全ダンス動画にアクセスでき、新着動画も見逃しません。",
    icon: <Heart className="h-8 w-8 text-rose-700" />,
  },
];

export const steps = [
  {
    id: 1,
    number: "01",
    title: "検索方法を選択",
    description: "楽曲検索またはグループ検索を選んでください",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 2,
    number: "02",
    title: "お気に入りを選択",
    description: "好きな楽曲やグループをクリックして選択",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 3,
    number: "03",
    title: "動画を楽しむ",
    description: "検索結果から動画を選んで視聴開始！",
    color: "from-blue-500 to-blue-600",
  },
];

export const painPoints = [
  {
    icon: <X className="text-red-500" />,
    text: '"IZ*ONE ダンスチャレンジ"で検索しても公式MVばかり',
  },
  {
    icon: <X className="text-red-500" />,
    text: "一般人の踊ってみた動画が混ざって見つからない",
  },
  {
    icon: <X className="text-red-500" />,
    text: "好きなグループの新しいダンス動画を毎回探すのが面倒",
  },
];

export const solutions = [
  {
    icon: <Check className="text-green-500" />,
    text: "アイドルのダンスチャレンジだけを厳選収録",
  },
  {
    icon: <Check className="text-green-500" />,
    text: "アイドルの公式ダンスチャレンジだけを厳選収録",
  },
  {
    icon: <Check className="text-green-500" />,
    text: "ワンタップで推しグループの動画一覧",
  },
];
