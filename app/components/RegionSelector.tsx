"use client";
import { useEffect, useState } from "react";

type Variety = {
  pokemon: {
    name: string;
  };
  is_main_series: boolean;
};

export default function RegionSelector({
  speciesUrl,
  onSelectForm,
}: {
  speciesUrl: string;
  onSelectForm: (name: string) => void;
}) {
  const [forms, setForms] = useState<string[]>([]);
  const [originalForm, setOriginalForm] = useState<string | null>(null);

  useEffect(() => {
    if (!speciesUrl) return;

    fetch(speciesUrl)
      .then((res) => res.json())
      .then((data) => {
        // Find all varieties and separate regional forms from the original
        const allForms = data.varieties.map((v: Variety) => v.pokemon.name);
        
        // Original form is the one without a hyphen (base form)
        const original = allForms.find((name: string) => !name.includes("-"));
        setOriginalForm(original || null);

        // Regional forms are those with a hyphen
        const regionForms = allForms.filter((name: string) => name.includes("-"));
        setForms(regionForms);
      });
  }, [speciesUrl]);

  return (
    <div className="flex gap-2 mt-2 mb-6 ml-14 flex-wrap" style={{ minHeight: "32px" }}>
      {originalForm && (
        <button
          onClick={() => onSelectForm(originalForm)}
          className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-sm font-semibold"
        >
          Original
        </button>
      )}
      {forms.map((form) => (
        <button
          key={form}
          onClick={() => onSelectForm(form)}
          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-sm"
        >
          {form.split("-")[1]}
        </button>
      ))}
    </div>
  );
}
