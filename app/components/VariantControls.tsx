type Gender = "male" | "female";
type Shine = "normal" | "shiny";

interface VariantControlsProps {
  gender: Gender;
  shine: Shine;
  hasFemale: boolean;
  hasShiny: boolean;
  onGenderChange: (gender: Gender) => void;
  onShineChange: (shine: Shine) => void;
}

export function VariantControls({
  gender,
  shine,
  hasFemale,
  hasShiny,
  onGenderChange,
  onShineChange
}: VariantControlsProps) {
  return (
    <div className="absolute -left-22.75 top-1/2 -translate-y-1/2 flex flex-col gap-2">
      {hasFemale && (
        <>
          <button
            onClick={() => onGenderChange("male")}
            className={`px-3 py-1 rounded-l-full border border-slate-700 text-xs font-semibold ${
              gender === "male"
                ? "bg-blue-500 text-slate-900"
                : "hover:bg-slate-700"
            }`}
          >
            Male
          </button>
          <button
            onClick={() => onGenderChange("female")}
            className={`px-3 py-1 rounded-l-full border border-slate-700 text-xs font-semibold ${
              gender === "female"
                ? "bg-pink-500 text-slate-900"
                : "hover:bg-slate-700"
            }`}
          >
            Female
          </button>
        </>
      )}

      {hasShiny && (
        <>
          <button
            onClick={() => onShineChange("normal")}
            className={`px-3 py-1 rounded-l-full border border-slate-700 text-xs font-semibold ${
              shine === "normal"
                ? "bg-amber-400 text-slate-900"
                : "hover:bg-slate-700"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => onShineChange("shiny")}
            className={`px-3 py-1 rounded-l-full border border-slate-700 bg-slate-900 text-xs font-semibold ${
              shine === "shiny"
                ? "bg-yellow-300 text-slate-900"
                : "hover:bg-slate-700"
            }`}
          >
            Shiny
          </button>
        </>
      )}
    </div>
  );
}