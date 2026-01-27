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
    <div className="flex flex-col md:absolute md:-left-22.75 md:top-1/2 md:-translate-y-1/2 gap-2 mb-4 md:mb-0">
      {hasFemale && (
        <>
          <button
            onClick={() => onGenderChange("male")}
            className={`px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold ${
              gender === "male"
                ? "bg-blue-500 text-slate-900"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Male
          </button>
          <button
            onClick={() => onGenderChange("female")}
            className={`px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold ${
              gender === "female"
                ? "bg-pink-500 text-slate-900"
                : "bg-slate-800 hover:bg-slate-700"
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
            className={`px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold ${
              shine === "normal"
                ? "bg-amber-400 text-slate-900"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => onShineChange("shiny")}
            className={`px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold ${
              shine === "shiny"
                ? "bg-yellow-300 text-slate-900"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            Shiny
          </button>
        </>
      )}
    </div>
  );
}