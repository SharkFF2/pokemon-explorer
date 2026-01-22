export const MYTHICAL_LIST = [
  151, 251, 385, 386, 489, 490, 491, 492, 493,
  494, 647, 648, 649, 719, 720, 721, 801, 802,
  807, 808, 809, 893, 902, 1008, 1024, 1025
];

export const ULTRA_BEAST_LIST = [
  793, 794, 795, 796, 797, 798, 799,
  803, 804, 805, 806
];

export const LEGENDARY_LIST = [
  144, 145, 146, 150,
  243, 244, 245, 249, 250,
  377, 378, 379, 380, 381, 382, 383, 384,
  480, 481, 482, 483, 484, 485, 486, 487, 488,
  638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  716, 717, 718,
  773, 785, 786, 787, 788,
  789, 790, 791, 792,
  800,
  888, 889, 890,
  894, 895, 896, 897,
  898,
  1001, 1002, 1003, 1004,
  1007, 1008,
  1020, 1021, 1022, 1023,
  1024, 1025
];

export type Rarity = "mythical" | "ultra" | "legendary" | "normal";

export type RarityConfig = {
  key: Rarity;
  chance: number;
  toast: string;
  badgeClass: string;
  glowClass: string;
};

export const RARITIES: RarityConfig[] = [
  {
    key: "mythical",
    chance: 0.005,
    toast: "🌸 You found a MYTHICAL Pokémon!",
    badgeClass: "bg-pink-600 text-white",
    glowClass: "border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.7)] bg-slate-900",
  },
  {
    key: "ultra",
    chance: 0.01,
    toast: "🔥 You found an ULTRA BEAST!",
    badgeClass: "bg-red-600 text-white",
    glowClass: "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] bg-slate-900",
  },
  {
    key: "legendary",
    chance: 0.01,
    toast: "✨ You found a LEGENDARY Pokémon!",
    badgeClass: "bg-purple-600 text-white",
    glowClass: "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)] bg-slate-900",
  },
];

export const roll = (chance: number) => Math.random() < chance;