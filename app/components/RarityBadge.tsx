import { Rarity } from "../constants";

interface RarityBadgeProps {
  rarity: Rarity;
  isShiny: boolean;
}

export function RarityBadge({ rarity, isShiny }: RarityBadgeProps) {
  const getBadgeText = (rarity: Rarity) => {
    switch (rarity) {
      case "mythical": return "MYTHICAL";
      case "ultra": return "ULTRA BEAST";
      case "legendary": return "LEGENDARY";
      default: return null;
    }
  };

  const getBadgeClass = (rarity: Rarity) => {
    switch (rarity) {
      case "mythical": return "bg-pink-600 text-white";
      case "ultra": return "bg-red-600 text-white";
      case "legendary": return "bg-purple-600 text-white";
      default: return "";
    }
  };

  const badgeText = getBadgeText(rarity);
  const badgeClass = getBadgeClass(rarity);

  return (
    <>
      {badgeText && (
        <span className={`px-2 py-1 text-xs font-bold rounded-md shadow-md whitespace-nowrap ${badgeClass}`}>
          {badgeText}
        </span>
      )}
      {isShiny && (
        <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-slate-900 rounded-md shadow-md">
          SHINY
        </span>
      )}
    </>
  );
}