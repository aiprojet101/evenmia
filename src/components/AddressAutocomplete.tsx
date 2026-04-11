"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";

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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "fr" },
      fields: ["formatted_address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        setValue(place.formatted_address);
        onPlaceSelected(place.formatted_address);
      }
    });

    setReady(true);
  }, [onPlaceSelected]);

  useEffect(() => {
    // Si Google Maps est deja charge
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    // Sinon on attend que le script charge
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        initAutocomplete();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [initAutocomplete]);

  return (
    <div>
      {label && <label className="text-sm text-[var(--text-light)] mb-1 block">{label}</label>}
      <div className="relative">
        <MapPin className="absolute left-4 top-3 w-4 h-4 text-[var(--rose)]" />
        <input
          ref={inputRef}
          className="input-light pl-11"
          placeholder={placeholder || "Entrez une adresse..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {!ready && (
          <Loader2 className="absolute right-4 top-3 w-4 h-4 text-[var(--text-lighter)] animate-spin" />
        )}
      </div>
    </div>
  );
}
