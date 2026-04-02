import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { mockCoupledCareWorkers, mockMedications } from "../../data/mockData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ListRow, StatusType } from "../../components/ListRow";
import { useClientHome } from "./hooks/useClientHome";
import { useMemo, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export default function ClientHome() {
  const {
    showOtherStaff,
    setShowOtherStaff,
    fastestCareWorker,
    beschikbaarCoupled,
    achterwachtCoupled,
    nietBeschikbaarCoupled,
    beschikbaarOther,
    achterwachtOther,
    nietBeschikbaarOther,
    navigateToChat,
  } = useClientHome();

  const [vraagDraft, setVraagDraft] = useState("");
  const [vraag, setVraag] = useState("");

  const recommended = useMemo(() => {
    const text = vraag.trim().toLowerCase();
    if (!text) return [];

    const hasAny = (words: string[]) => words.some((w) => text.includes(w));
    const roles: Array<"Psycholoog" | "Verpleegkundige" | "Begeleider"> = [];

    // Psycholoog triggers
    if (
      hasAny([
        "angst", "paniek", "paniekaanval", "stress", "somber", "depressie", 
        "trauma", "slaap", "gedachten", "suïcide", "suicide", "zelfmoord",
        "zelfbeschadiging", "automutilatie", "neerslachtig", "verdrietig", 
        "hopeloos", "onzeker", "burn-out", "overspannen", "prikkelbaar", 
        "eenzaam", "fobie", "spanning", "gejaagd", "dwang", "herbeleving", 
        "flashback", "onrust", "wanhoop", "concentratie", "piekeren", "verward"
      ])
    ) {
      roles.push("Psycholoog");
    }

    // Verpleegkundige triggers
    if (
      hasAny([
        "medicatie", "medicijn", "bijwerking", "dosering", "pijn", "koorts", 
        "misselijk", "hoofdpijn", "duizelig", "infectie", "recept", "kuur", 
        "pil", "tablet", "injectie", "prik", "insuline", "voorraad", "afbouwen", 
        "wond", "verband", "bloeddruk", "suikerwaarde", "ontsteking", "braken", 
        "moe", "vermoeidheid", "uitputting", "benauwd", "obstipatie", "diarree"
      ])
    ) {
      roles.push("Verpleegkundige");
    }

    // Begeleider triggers
    if (
      hasAny([
        "afspraak", "planning", "dag", "school", "werk", "thuis", "begeleiding", 
        "hulp", "ondersteuning", "praktisch", "structuur", "ritme", "dagbesteding", 
        "vrije tijd", "sport", "hobby", "brief", "post", "financiën", "geld", 
        "budget", "instanties", "gemeente", "uitkering", "kamer", "buren", 
        "familie", "vrienden", "ruzie", "conflict", "bezoek", "koken", 
        "boodschappen", "huishouden", "opruimen", "douchen", "zelfzorg"
      ])
    ) {
      roles.push("Begeleider");
    }

    const uniqueRoles = Array.from(new Set(roles));
    if (uniqueRoles.length === 0) return [];

    const byRole = (role: string) => {
      const combined = [...beschikbaarCoupled, ...achterwachtCoupled, ...nietBeschikbaarCoupled];
      const matches = combined.filter((w) => w.role === role);
      const sorted = [
        ...matches.filter((w) => w.status === "beschikbaar"),
        ...matches.filter((w) => w.status === "achterwacht"),
        ...matches.filter((w) => w.status === "niet-beschikbaar"),
      ];
      return sorted;
    };

    const recs = uniqueRoles.flatMap((r) => byRole(r).slice(0, 2));
    // dedupe on id, preserve order
    const seen = new Set<number>();
    return recs.filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }, [vraag, beschikbaarCoupled, achterwachtCoupled, nietBeschikbaarCoupled]);

  const faqItems = useMemo<FaqItem[]>(
    () => [
      {
        id: "panic",
        question: "Wat kan ik doen bij paniek of een paniekaanval?",
        answer:
          "Probeer je ademhaling te vertragen (bijv. 4 tellen in, 6 tellen uit), zet je voeten stevig op de grond en benoem 5 dingen die je ziet. Als het niet zakt of je voelt je onveilig: stuur een bericht naar een beschikbare medewerker of gebruik SOS.",
      },
      {
        id: "anxiety",
        question: "Hoe herken ik angstklachten?",
        answer:
          "Angst kan zich uiten in piekeren, onrust, hartkloppingen, gespannen spieren, slecht slapen of vermijden van situaties. Het helpt om patronen bij te houden en hierover te chatten met je zorgteam.",
      },
      {
        id: "depression",
        question: "Wat zijn signalen van depressieve klachten?",
        answer:
          "Denk aan somberheid, minder energie, geen plezier, concentratieproblemen, veranderingen in slaap/eetlust en negatieve gedachten. Bij aanhoudende klachten is het goed om contact op te nemen met je begeleider/psycholoog via chat.",
      },
      {
        id: "overprikkeling",
        question: "Wat kan helpen bij overprikkeling?",
        answer:
          "Zoek een rustige plek, dim licht/geluid, neem korte pauzes en plan herstelmomenten. Kleine dingen zoals water drinken, een korte wandeling of een prikkelarme activiteit kunnen al helpen.",
      },
      {
        id: "medication",
        question: "Waar kan ik terecht met vragen over medicatie?",
        answer:
          "Bespreek bijwerkingen, dosering of twijfels altijd met je behandelaar of apotheek. Je kunt via chat je vraag alvast neerleggen bij je zorgteam, maar stop nooit zomaar met medicatie zonder overleg.",
      },
      {
        id: "sleep",
        question: "Ik slaap slecht. Wat kan ik proberen?",
        answer:
          "Houd een vaste bedtijd aan, beperk schermen/cafeïne laat op de dag en maak een korte ontspanningsroutine. Als slecht slapen langer aanhoudt, bespreek het via chat zodat er meegekeken kan worden.",
      },
      {
        id: "selfharm",
        question: "Wat als ik gedachten heb aan zelfbeschadiging of suïcide?",
        answer:
          "Zoek direct hulp. Gebruik SOS, stuur een bericht naar een beschikbare medewerker en bel bij acute dreiging 112. In Nederland kun je ook 113 Zelfmoordpreventie bereiken via 113 of 0800-0113.",
      },
      {
        id: "therapy",
        question: "Hoe bereid ik een gesprek met mijn behandelaar voor?",
        answer:
          "Schrijf vooraf 2–3 punten op: wat ging beter, wat ging lastiger en welke vraag je wilt stellen. Het kan helpen om voorbeelden (situaties/gedachten/gevoelens) te noteren zodat je niets vergeet.",
      },
    ],
    []
  );

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [showMedicatie, setShowMedicatie] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full mx-auto">
      <TealHeader title="YoungConnect" />

      {/* Nearest Staff Highlight Card */}
      <div className="p-4">
        <div className="border-2 border-primary rounded-lg p-4 bg-primary/10">
          <div className="text-sm text-muted-foreground mb-2">Snelst bereikbaar</div>
          <div className="font-bold text-lg mb-1">{fastestCareWorker.name}</div>
          <div className="text-sm text-muted-foreground mb-3">{fastestCareWorker.role}</div>
          <button
            onClick={() => navigateToChat(fastestCareWorker.id)}
            className="bg-secondary text-secondary-foreground py-3 px-6 rounded-full font-medium hover:bg-secondary/90 transition-colors"
          >
            Neem contact op
          </button>
        </div>
      </div>

      {/* Stel een vraag*/}
      <div className="px-4 mb-4">
        <div className="border border-border rounded-2xl bg-card p-4">
          <div className="font-bold text-foreground mb-2">Stel een vraag</div>
          <div className="text-sm text-muted-foreground mb-3">
            Beschrijf kort je vraag. We raden passende medewerkers aan (bijv. psycholoog of verpleegkundige).
          </div>

          <textarea
            value={vraagDraft}
            onChange={(e) => setVraagDraft(e.target.value)}
            placeholder="Bijv. Ik heb last van angst en slaap slecht…"
            className="w-full min-h-[92px] p-3 rounded-lg border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setVraag(vraagDraft)}
              className="bg-secondary text-secondary-foreground py-2.5 px-4 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Aanbevelen
            </button>
            <button
              type="button"
              onClick={() => {
                setVraagDraft("");
                setVraag("");
              }}
              className="py-2.5 px-4 rounded-lg font-medium border border-border bg-background hover:bg-muted/50 transition-colors"
            >
              Wissen
            </button>
          </div>

          {vraag.trim() && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-foreground mb-2">Aanbevolen medewerkers</div>

              {recommended.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Geen specifieke match gevonden. Je kunt ook direct contact opnemen met de snelst bereikbare medewerker
                  hierboven.
                </div>
              ) : (
                <div className="space-y-2">
                  {recommended.map((w) => (
                    <div
                      key={w.id}
                      className="border border-border rounded-lg p-3 bg-background flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-medium text-foreground">{w.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {w.role} •{" "}
                          <span
                            className={
                              w.status === "beschikbaar"
                                ? "text-green-600 dark:text-green-400 font-semibold"
                                : w.status === "achterwacht"
                                ? "text-primary font-semibold"
                                : "text-muted-foreground font-semibold"
                            }
                          >
                            {w.status === "beschikbaar"
                              ? "Beschikbaar"
                              : w.status === "achterwacht"
                              ? "Achterwacht"
                              : "Niet beschikbaar"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateToChat(w.id)}
                        className="shrink-0 bg-primary text-primary-foreground py-2 px-3 rounded-lg font-medium hover:opacity-95 active:opacity-90 transition-opacity"
                      >
                        Ga naar chat
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mijn medicatie */}
      <div className="px-4 my-4">
        <button
          type="button"
          onClick={() => setShowMedicatie(!showMedicatie)}
          className="w-full border border-border rounded-2xl bg-card p-4 flex items-center justify-between text-left hover:bg-muted/50 active:bg-muted transition-colors"
        >
          <div>
            <div className="font-bold text-foreground">Mijn medicatie</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {mockMedications.length} medicijn{mockMedications.length !== 1 ? "en" : ""} voorgeschreven
            </div>
          </div>
          {showMedicatie ? <ChevronUp size={20} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" />}
        </button>

        {showMedicatie && (
          <div className="mt-2 space-y-2">
            {mockMedications.map((med) => (
              <div key={med.id} className="border border-border rounded-xl bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-foreground">{med.name}</div>
                  <div className="text-sm font-medium text-primary shrink-0">{med.dosage}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{med.frequency}</div>
                <div className="text-sm text-muted-foreground mt-1">Doel: {med.purpose}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Voorgeschreven door {med.prescribedBy} · Vanaf {new Date(med.startDate).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mijn zorgteam Section */}
      <div className="px-4 mb-4">
        <div className="font-bold text-foreground mb-3">Mijn zorgteam</div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {mockCoupledCareWorkers.map((worker) => (
            <div
              key={worker.id}
              className="flex-shrink-0 w-20 flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl font-medium">
                    {worker.name.charAt(0)}
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${
                    worker.status === "beschikbaar"
                      ? "bg-green-500"
                      : worker.status === "achterwacht"
                      ? "bg-primary"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="text-xs text-center text-foreground">
                {worker.name.split(" ")[0]}
              </div>
              <div className="text-xs text-center text-muted-foreground">{worker.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Section - Coupled Workers */}
      {beschikbaarCoupled.length > 0 && (
        <>
          <SectionBar title="Beschikbaar" />
          {beschikbaarCoupled.map((staff) => (
            <ListRow
              key={staff.id}
              name={staff.name}
              subtitle={staff.role}
              status={staff.status as StatusType}
              onClick={() => navigateToChat(staff.id)}
            />
          ))}
        </>
      )}

      {achterwachtCoupled.length > 0 && (
        <>
          <SectionBar title="Achterwacht" />
          {achterwachtCoupled.map((staff) => (
            <ListRow
              key={staff.id}
              name={staff.name}
              subtitle={staff.role}
              status={staff.status as StatusType}
              badge="Achterwacht"
              onClick={() => navigateToChat(staff.id)}
            />
          ))}
        </>
      )}

      {nietBeschikbaarCoupled.length > 0 && (
        <>
          <SectionBar title="Niet beschikbaar" />
          {nietBeschikbaarCoupled.map((staff) => (
            <ListRow
              key={staff.id}
              name={staff.name}
              subtitle={staff.role}
              status={staff.status as StatusType}
              onClick={() => navigateToChat(staff.id)}
            />
          ))}
        </>
      )}

      {/* Collapsible Other Staff */}
      {/* <button
        onClick={() => setShowOtherStaff(!showOtherStaff)}
        className="w-full px-4 py-3 border-b border-border flex items-center justify-between text-muted-foreground hover:bg-muted"
      >
        <span>Overige medewerkers</span>
        {showOtherStaff ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button> */}

      {showOtherStaff && (
        <>
          {beschikbaarOther.length > 0 &&
            beschikbaarOther.map((staff) => (
              <ListRow
                key={staff.id}
                name={staff.name}
                subtitle={staff.role}
                status={staff.status as StatusType}
                onClick={() => navigateToChat(staff.id)}
              />
            ))}

          {achterwachtOther.length > 0 &&
            achterwachtOther.map((staff) => (
              <ListRow
                key={staff.id}
                name={staff.name}
                subtitle={staff.role}
                status={staff.status as StatusType}
                badge="Achterwacht"
                onClick={() => navigateToChat(staff.id)}
              />
            ))}

          {nietBeschikbaarOther.length > 0 &&
            nietBeschikbaarOther.map((staff) => (
              <ListRow
                key={staff.id}
                name={staff.name}
                subtitle={staff.role}
                status={staff.status as StatusType}
                onClick={() => navigateToChat(staff.id)}
              />
            ))}
        </>
      )}

      

      {/* FAQ Section */}
      <div className="px-4 my-4">
        <div className="border border-border rounded-2xl bg-primary overflow-hidden">
          <div className="px-4 py-4 border-border">
            <div className="font-bold text-white">FAQ (GGZ)</div>
            <div className="text-sm text-white mt-1">
              Snelle info over veelvoorkomende onderwerpen. Bij zorgen: chat met je zorgteam.
            </div>
          </div>

          <div className="p-2 space-y-2">
            {faqItems.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white [-webkit-tap-highlight-color:transparent]"
                  >
                    <span className="font-medium text-black">{item.question}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-black flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-black flex-shrink-0" />
                    )}
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`px-4 pb-4 text-sm text-black leading-relaxed transition-opacity duration-200 ${
                          isOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ClientBottomNav />
    </div>
  );
}
