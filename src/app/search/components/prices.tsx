'use client'
import { ChangeEvent, useEffect, useRef, KeyboardEvent } from "react";

interface PricesProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setPricesChanges: (value: boolean) => void;
}

export default function Prices({
  open,
  setOpen,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  setPricesChanges,
}: PricesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  const handleGlobalKeyDown = (event: Event) => {
    const keyboardEvent = event as unknown as KeyboardEvent; // Casting doble
  
    if (keyboardEvent.key === "Enter" && open) {
      if (
        document.activeElement !== ref.current?.querySelector("#min_price") &&
        document.activeElement !== ref.current?.querySelector("#max_price")
      ) {
        setOpen(false);
      }
    }
  };
  
  

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleGlobalKeyDown); // Escucha global para teclas
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown); // Elimina el listener global
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const HandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (/^\d*\.?\d*$/.test(value)) {
      setPricesChanges(true); // Actualiza el estado de cambios al cambiar el valor
      if (name === "max_price") {
        setMaxPrice(Number(value));
        if (Number(value) > 99999) {
          setMaxPrice(0);
        }
      }

      if (name === "min_price") {
        setMinPrice(Number(value));
        if (Number(value) > 99999) {
          setMinPrice(0);
        }
      }
    }
  };

  const handlePricesRanges = () => {
    if (minPrice > maxPrice) {
      setMaxPrice(0);
    }
  };

  const handleKeyDownMin = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      maxInputRef.current?.focus(); // Enfoca el input de max_price
    }
  };

  const handleKeyDownMax = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePricesRanges(); // Verifica los rangos antes de cerrar
      setOpen(false); // Cierra el componente
    }
  };

  return open ? (
    <div
      ref={ref}
      className="z-30 absolute select-none flex h-full w-full rounded-lg bg-slate-50 shadow-lg shadow-[#0000004D]"
    >
      <div className="flex h-full w-1/2">
        <div className="flex h-full w-1/3 items-center justify-center">
          <h2 className="select-none font-lekton">Min</h2>
        </div>
        <div className="flex h-full w-2/3 items-center justify-start">
          <div className="flex h-2/5 w-11/12 rounded-xl border border-slate-700">
            <input
              className="h-full w-9/12 rounded-lg border-none bg-transparent focus:ring-transparent"
              type="text"
              id="min_price"
              name="min_price"
              value={minPrice !== null ? minPrice : ""}
              onChange={HandleChange}
              onKeyDown={handleKeyDownMin}
              placeholder={`${minPrice}`}
              inputMode="numeric"
              autoComplete="off"
              onBlur={handlePricesRanges}
            />
            <div className="select-none flex h-full w-3/12 justify-center rounded-lg font-lekton">
              $
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full w-1/2">
        <div className="flex h-full w-1/3 items-center justify-center">
          <h2 className="font-lekton select-none">Max</h2>
        </div>
        <div className="flex h-full w-2/3 items-center justify-start">
          <div className="flex h-2/5 w-11/12 rounded-xl border border-slate-700">
            <input
              ref={maxInputRef}
              className="h-full w-9/12 rounded-lg border-none bg-transparent focus:ring-transparent"
              type="text"
              id="max_price"
              name="max_price"
              value={maxPrice !== null ? maxPrice : ""}
              onChange={HandleChange}
              onKeyDown={handleKeyDownMax}
              placeholder={`${maxPrice}`}
              inputMode="numeric"
              autoComplete="off"
              onBlur={handlePricesRanges}
            />
            <div className="select-none flex h-full w-3/12 justify-center rounded-lg font-lekton">
              $
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
