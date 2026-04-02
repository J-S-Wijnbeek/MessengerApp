import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Search } from "lucide-react";
import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";

type OpenFdaLabelResult = {
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    route?: string[];
    product_type?: string[];
    substance_name?: string[];
  };
  active_ingredient?: string[];
  purpose?: string[];
  indications_and_usage?: string[];
  warnings?: string[];
  do_not_use?: string[];
  ask_doctor?: string[];
  ask_doctor_or_pharmacist?: string[];
  when_using?: string[];
  stop_use?: string[];
  pregnancy_or_breast_feeding?: string[];
  keep_out_of_reach_of_children?: string[];
  dosage_and_administration?: string[];
  storage_and_handling?: string[];
  inactive_ingredient?: string[];
};

type OpenFdaResponse = {
  results?: OpenFdaLabelResult[];
};

type FdaSection = {
  titleNl: string;
  contentEn: string;
};

type Suggestion = {
  id: string;
  name: string;
  description?: string;
  score: number;
  source: "local" | "fda";
};

function normalizeText(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

// openFDA suggesties caching + rate limiting
const FDA_SUGGEST_CACHE_KEY = "zc_fda_suggest_cache_v1";
let fdaSuggestLastRequestAtMs = 0;
const FDA_SUGGEST_MIN_INTERVAL_MS = 700;

function safeGetFdaSuggestCache(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(FDA_SUGGEST_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string[]>;
  } catch {
    return {};
  }
}

function safeSetFdaSuggestCache(cache: Record<string, string[]>) {
  try {
    localStorage.setItem(FDA_SUGGEST_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

async function rateLimitFdaSuggest() {
  const now = Date.now();
  const waitMs = Math.max(0, fdaSuggestLastRequestAtMs + FDA_SUGGEST_MIN_INTERVAL_MS - now);
  if (waitMs > 0) await new Promise((r) => setTimeout(r, waitMs));
  fdaSuggestLastRequestAtMs = Date.now();
}

function toFdaSectionsNl(r: OpenFdaLabelResult): FdaSection[] {
  const pick = (arr?: string[]) => (arr && arr.length ? normalizeText(arr.join(" ")) : "");

  const sections: Array<{ key: keyof OpenFdaLabelResult; titleNl: string }> = [
    { key: "active_ingredient", titleNl: "Werkzame stof" },
    { key: "purpose", titleNl: "Doel" },
    { key: "indications_and_usage", titleNl: "Toepassingen" },
    { key: "warnings", titleNl: "Waarschuwingen" },
    { key: "do_not_use", titleNl: "Niet gebruiken" },
    { key: "ask_doctor", titleNl: "Vraag een arts" },
    { key: "ask_doctor_or_pharmacist", titleNl: "Vraag een arts of apotheker" },
    { key: "when_using", titleNl: "Tijdens gebruik" },
    { key: "stop_use", titleNl: "Stop met gebruiken" },
    { key: "pregnancy_or_breast_feeding", titleNl: "Zwangerschap en borstvoeding" },
    { key: "keep_out_of_reach_of_children", titleNl: "Buiten bereik van kinderen houden" },
    { key: "dosage_and_administration", titleNl: "Dosering en gebruik" },
    { key: "storage_and_handling", titleNl: "Bewaren" },
    { key: "inactive_ingredient", titleNl: "Hulpstoffen" },
  ];

  return sections
    .map((s) => ({ titleNl: s.titleNl, contentEn: pick(r[s.key] as string[] | undefined) }))
    .filter((x) => x.contentEn);
}

export default function ClientMedicatieZoeken() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [fdaLoading, setFdaLoading] = useState(false);
  const [fdaError, setFdaError] = useState<string | null>(null);
  const [fdaResult, setFdaResult] = useState<OpenFdaLabelResult | null>(null);
  const [fdaSuggestLoading, setFdaSuggestLoading] = useState(false);
  const [fdaPrefixSuggestionNames, setFdaPrefixSuggestionNames] = useState<string[]>([]);
  const [fdaContainsSuggestionNames, setFdaContainsSuggestionNames] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedSectionTitles, setExpandedSectionTitles] = useState<Record<string, boolean>>({});
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      setFdaPrefixSuggestionNames([]);
      setFdaContainsSuggestionNames([]);
      setFdaSuggestLoading(false);
      return;
    }

    let controller: AbortController | null = null;

    // Debounce: openFDA suggestions tijdens typen
    const t = window.setTimeout(async () => {
      controller = new AbortController();
      try {
        setFdaSuggestLoading(true);

        const cache = safeGetFdaSuggestCache();

        const prefixCacheKey = `generic_prefix:${q}`;
        if (cache[prefixCacheKey]) {
          setFdaPrefixSuggestionNames(cache[prefixCacheKey]);
        } else {
          await rateLimitFdaSuggest();
          const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(
            `${q}*`
          )}&limit=25`;
          const res = await fetch(url, { signal: controller.signal });

          // openFDA geeft vaak 404 bij 0 resultaten
          if (res.status === 404) {
            setFdaPrefixSuggestionNames([]);
            cache[prefixCacheKey] = [];
            safeSetFdaSuggestCache(cache);
          } else {
            if (!res.ok) throw new Error(`openFDA suggesties fout (${res.status})`);

            const data = (await res.json()) as OpenFdaResponse;
            const names = new Set<string>();
            for (const r of data.results ?? []) {
              for (const n of r.openfda?.generic_name ?? []) {
                if (n && n.toLowerCase().startsWith(q)) names.add(n.toLowerCase());
              }
            }

            const sorted = Array.from(names)
              .sort((a, b) => a.localeCompare(b))
              .slice(0, 10);
            setFdaPrefixSuggestionNames(sorted);
            cache[prefixCacheKey] = sorted;
            safeSetFdaSuggestCache(cache);
          }
        }

        // "contains" search (pas vanaf 3 letters i.v.m. performance/ruis)
        if (q.length >= 3) {
          const containsCacheKey = `generic_contains:${q}`;
          if (cache[containsCacheKey]) {
            setFdaContainsSuggestionNames(cache[containsCacheKey]);
          } else {
            await rateLimitFdaSuggest();
            const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(
              `*${q}*`
            )}&limit=50`;
            const res = await fetch(url, { signal: controller.signal });

            // openFDA geeft vaak 404 bij 0 resultaten
            if (res.status === 404) {
              setFdaContainsSuggestionNames([]);
              cache[containsCacheKey] = [];
              safeSetFdaSuggestCache(cache);
            } else {
              if (!res.ok) throw new Error(`openFDA suggesties fout (${res.status})`);

              const data = (await res.json()) as OpenFdaResponse;
              const names = new Set<string>();
              for (const r of data.results ?? []) {
                for (const n of r.openfda?.generic_name ?? []) {
                  const nl = n?.toLowerCase();
                  if (!nl) continue;
                  if (nl.includes(q)) names.add(nl);
                }
              }

              const sorted = Array.from(names)
                .sort((a, b) => a.localeCompare(b))
                .slice(0, 20);
              setFdaContainsSuggestionNames(sorted);
              cache[containsCacheKey] = sorted;
              safeSetFdaSuggestCache(cache);
            }
          }
        } else {
          setFdaContainsSuggestionNames([]);
        }
      } catch (e) {
        // AbortErrors tijdens snel typen niet als "error" behandelen
        if (e instanceof Error && e.name === "AbortError") return;
        setFdaPrefixSuggestionNames([]);
        setFdaContainsSuggestionNames([]);
      } finally {
        setFdaSuggestLoading(false);
      }
    }, 650);

    return () => {
      window.clearTimeout(t);
      controller?.abort();
    };
  }, [query]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = query.trim();
    if (!q) return [];

    // Autocomplete: contains én startsWith (toon startsWith eerst)
    const qLower = q.toLowerCase();

    const candidates = new Set<string>([...fdaPrefixSuggestionNames, ...fdaContainsSuggestionNames]);
    const scored: Suggestion[] = [];
    for (const n of candidates) {
      const nl = n.toLowerCase();
      if (!nl.includes(qLower)) continue;
      const starts = nl.startsWith(qLower);
      scored.push({
        id: `fda-${n}`,
        name: n,
        score: starts ? 2 : 1,
        source: "fda" as const,
      });
    }

    scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return scored.slice(0, 10);
  }, [query, fdaPrefixSuggestionNames, fdaContainsSuggestionNames]);

  const commitSearch = (nextQuery: string) => {
    const q = nextQuery.trim();
    setCommittedQuery(q);
    if (!q) {
      setFdaResult(null);
      setFdaError(null);
      setFdaLoading(false);
    }
  };

  const commitSuggestionAtIndex = (idx: number) => {
    if (idx < 0 || idx >= suggestions.length) return;
    const name = suggestions[idx].name;
    setQuery(name);
    commitSearch(name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  useEffect(() => {
    // als je typt of suggestions wijzigen: reset de "actieve" selectie
    setActiveSuggestionIndex(-1);
  }, [query, suggestions.length]);

  useEffect(() => {
    const q = committedQuery.trim();
    if (!q) {
      setFdaResult(null);
      setFdaError(null);
      setFdaLoading(false);
      return;
    }

    // Debounce zodat we niet elke toetsaanslag meteen fetchen
    const t = window.setTimeout(async () => {
      try {
        setFdaLoading(true);
        setFdaError(null);

        const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${encodeURIComponent(
          q.toLowerCase()
        )}&limit=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`openFDA fout (${res.status})`);
        const data = (await res.json()) as OpenFdaResponse;
        const first = data.results?.[0] ?? null;
        setFdaResult(first);
      } catch (e) {
        setFdaResult(null);
        setFdaError(e instanceof Error ? e.message : "Onbekende fout");
      } finally {
        setFdaLoading(false);
      }
    }, 450);

    return () => window.clearTimeout(t);
  }, [committedQuery]);

  const fdaSections = useMemo(() => (fdaResult ? toFdaSectionsNl(fdaResult) : []), [fdaResult]);
  const fdaTitle = useMemo(() => {
    const generic = fdaResult?.openfda?.generic_name?.[0];
    const brand = fdaResult?.openfda?.brand_name?.[0];
    return generic || brand || null;
  }, [fdaResult]);

  useEffect(() => {
    setExpandedSectionTitles({});
  }, [fdaResult]);

  const renderCollapsibleText = (title: string, text: string) => {
    const threshold = 420;
    const normalized = normalizeText(text);
    const isLong = normalized.length > threshold;
    const isExpanded = Boolean(expandedSectionTitles[title]);
    const shown = !isLong || isExpanded ? normalized : `${normalized.slice(0, threshold).trimEnd()}…`;

    return (
      <>
        <div className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{shown}</div>
        {isLong && (
          <button
            type="button"
            onClick={() =>
              setExpandedSectionTitles((prev) => ({
                ...prev,
                [title]: !prev[title],
              }))
            }
            className="mt-2 text-sm font-medium text-secondary hover:underline"
          >
            {isExpanded ? "Lees minder" : "Lees meer"}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full mx-auto">
      <TealHeader
        title="Medicatie"
        subtitle="Zoek je medicatie"
        rightIcon={
          <button
            type="button"
            onClick={() => navigate("/instellingen")}
            className="p-1 rounded hover:bg-primary/90 transition-colors"
            aria-label="Terug naar instellingen"
          >
            <ChevronLeft size={20} />
          </button>
        }
      />

      <div className="p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Zoek op generieke naam (bv. ibuprofen)…"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                if (!showSuggestions) setShowSuggestions(true);
                e.preventDefault();
                setActiveSuggestionIndex((prev) => {
                  const next = Math.min(prev + 1, suggestions.length - 1);
                  return Number.isFinite(next) ? next : -1;
                });
                return;
              }

              if (e.key === "ArrowUp") {
                if (!showSuggestions) setShowSuggestions(true);
                e.preventDefault();
                setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
                return;
              }

              if (e.key === "Tab") {
                // Autocomplete: vul beste suggestie aan, maar commit nog niet automatisch (tenzij je daarna Enter doet)
                if (showSuggestions && suggestions.length > 0) {
                  e.preventDefault();
                  const idx = activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0;
                  setQuery(suggestions[idx].name);
                  setActiveSuggestionIndex(idx);
                }
                return;
              }

              if (e.key === "Enter") {
                if (showSuggestions && activeSuggestionIndex >= 0) {
                  commitSuggestionAtIndex(activeSuggestionIndex);
                } else {
                  commitSearch(query);
                  setShowSuggestions(false);
                  setActiveSuggestionIndex(-1);
                }
              }

              if (e.key === "Escape") {
                setShowSuggestions(false);
                setActiveSuggestionIndex(-1);
              }
            }}
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="medicatie-suggesties"
          />
        </div>

        {showSuggestions && query.trim() && suggestions.length > 0 && (
          <div
            id="medicatie-suggesties"
            className="mt-2 border border-border rounded-lg bg-card overflow-hidden"
            role="listbox"
          >
            {suggestions.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery(s.name);
                  commitSearch(s.name);
                  setShowSuggestions(false);
                  setActiveSuggestionIndex(-1);
                }}
                className={`w-full px-3 py-3 text-left transition-colors border-b border-border last:border-b-0 ${
                  idx === activeSuggestionIndex ? "bg-muted/70" : "hover:bg-muted/60 active:bg-muted"
                }`}
                role="option"
                aria-selected={idx === activeSuggestionIndex}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.source === "fda" ? "openFDA" : `${Math.round(s.score * 100)}%`}
                  </div>
                </div>
                {s.description && <div className="text-sm text-muted-foreground mt-1">{s.description}</div>}
              </button>
            ))}
            {fdaSuggestLoading && (
              <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">Suggesties laden…</div>
            )}
          </div>
        )}
      </div>

      <div className="px-4">
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Engelse resultaten van de FDA (via openFDA), deze resultaten kunnen mogelijk afwijken van Nederlandse medicatie.</div>
          <div className="text-sm text-muted-foreground mb-2">Ga dus voorzichtig om met deze resultaten en vraag bij twijfel aan een professional.</div>

          {fdaLoading && (
            <div className="border border-border rounded-lg p-4 bg-card text-muted-foreground">Bezig met ophalen…</div>
          )}

          {!fdaLoading && fdaError && (
            <div className="border border-border rounded-lg p-4 bg-card text-muted-foreground">{fdaError}</div>
          )}

          {!fdaLoading && !fdaError && !fdaResult && committedQuery.trim() && (
            <div className="border border-border rounded-lg p-4 bg-card text-muted-foreground">
              Geen openFDA resultaat gevonden voor “{committedQuery}”.
            </div>
          )}

          {!fdaLoading && !fdaError && fdaResult && (
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="font-semibold">{fdaTitle ?? "Medicatie"}</div>
              {fdaResult.openfda?.manufacturer_name?.[0] && (
                <div className="text-sm text-muted-foreground mt-1">
                  Fabrikant: {fdaResult.openfda.manufacturer_name[0]}
                </div>
              )}

              {fdaResult.openfda?.manufacturer_name?.[0] && (
                <div />
              )}

              <div className="mt-3 space-y-3">
                {fdaSections.map((s) => {
                  return (
                    <div key={s.titleNl}>
                      <div className="text-sm font-semibold">{s.titleNl}</div>
                      {renderCollapsibleText(s.titleNl, s.contentEn)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ClientBottomNav />
    </div>
  );
}
