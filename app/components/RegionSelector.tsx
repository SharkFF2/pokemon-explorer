"use client";
import { useEffect, useState } from "react";

type Variety = {
  pokemon: {
    name: string;
  };
};

export default function RegionSelector({
  speciesUrl,
  onSelectForm,
}: {
  speciesUrl: string;
  onSelectForm: (name: string) => void;
}) {
  const [forms, setForms] = useState<string[]>([]);

  useEffect(() => {
    if (!speciesUrl) return;

    fetch(speciesUrl)
      .then((res) => res.json())
      .then((data) => {
        const regionForms = data.varieties
          .map((v: Variety) => v.pokemon.name)
          .filter((name: string) => name.includes("-"));

        setForms(regionForms);
      });
  }, [speciesUrl]);

  if (forms.length === 0) return null;

  return (
    <div className="flex gap-2 mt-2">
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
