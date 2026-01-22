type Facing = "front" | "back";
type Gender = "male" | "female";
type Shine = "normal" | "shiny";

interface PokemonSpriteProps {
  spriteUrl: string | null;
  facing: Facing;
  gender: Gender;
  shine: Shine;
  onFacingChange: (facing: Facing) => void;
  glowClass: string;
}

export function PokemonSprite({ spriteUrl, facing, gender, shine, onFacingChange, glowClass }: PokemonSpriteProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      <div className={`w-48 h-48 rounded-xl flex items-center justify-center border ${glowClass}`}>
        {spriteUrl ? (
          <img
            src={spriteUrl}
            alt="Pokemon sprite"
            className="w-40 h-40 object-contain image-rendering-pixelated"
          />
        ) : (
          <span className="text-sm text-slate-400">No sprite available</span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onFacingChange("front")}
          className={`px-3 py-1 rounded-md text-xs font-semibold border border-slate-700 ${
            facing === "front"
              ? "bg-emerald-500 text-slate-900"
              : "bg-slate-900 hover:bg-slate-700"
          }`}
        >
          Front
        </button>
        <button
          onClick={() => onFacingChange("back")}
          className={`px-3 py-1 rounded-md text-xs font-semibold border border-slate-700 ${
            facing === "back"
              ? "bg-emerald-500 text-slate-900"
              : "bg-slate-900 hover:bg-slate-700"
          }`}
        >
          Back
        </button>
      </div>

      <p className="text-sm text-slate-400">
        Viewing:{" "}
        <span className="font-semibold text-slate-100">
          {gender} / {shine} / {facing}
        </span>
      </p>
    </div>
  );
}