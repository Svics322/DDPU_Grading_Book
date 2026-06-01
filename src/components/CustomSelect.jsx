import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Оберіть значення",
  searchable = true,
  error,
  icon: Icon,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const selected = options.find((option) => String(option.value) === String(value));

  const filteredOptions = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return options;
    return options.filter((option) => option.label.toLowerCase().includes(text));
  }, [options, query]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function pick(option) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="field custom-select-field" ref={rootRef}>
      {label && <span>{label}</span>}
      <button type="button" className={`custom-select-trigger ${open ? "is-open" : ""}`} onClick={() => setOpen((current) => !current)}>
        {Icon && <Icon size={17} />}
        <span className={selected ? "" : "placeholder-text"}>{selected?.label || placeholder}</span>
        <ChevronDown size={17} />
      </button>
      {open && (
        <div className="custom-select-menu">
          {searchable && (
            <label className="custom-select-search">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук" autoFocus />
            </label>
          )}
          <div className="custom-select-options">
            {filteredOptions.length === 0 && <div className="custom-select-empty">Нічого не знайдено</div>}
            {filteredOptions.map((option) => {
              const OptionIcon = option.icon;
              const active = String(option.value) === String(value);
              return (
                <button key={String(option.value)} type="button" className={`custom-select-option ${active ? "active" : ""}`} onClick={() => pick(option)}>
                  {OptionIcon && <OptionIcon size={16} />}
                  <span>{option.label}</span>
                  {active && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && <small>{error}</small>}
    </div>
  );
}
