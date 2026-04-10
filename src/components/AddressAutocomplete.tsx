"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

declare global {
  interface Window {
    google?: typeof google;
  }
}

interface Props {
  label: string;
  placeholder?: string;
  onPlaceSelected: (address: string) => void;
}

export default function AddressAutocomplete({ label, placeholder, onPlaceSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "fr" },
      fields: ["formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setValue(place.formatted_address);
        onPlaceSelected(place.formatted_address);
      }
    });
  }, [onPlaceSelected]);

  return (
    <div>
      <label className="text-sm text-[var(--text-light)] mb-1 block">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-4 top-3 w-4 h-4 text-[var(--rose)]" />
        <input
          ref={inputRef}
          className="input-light pl-11"
          placeholder={placeholder || "Entrez une adresse..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
