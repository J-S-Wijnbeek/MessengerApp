import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Plus, Trash2, User, Notebook } from "lucide-react";
import { useClientProfiel } from "./hooks/useClientProfiel";
import { useMemo, useState } from "react";

type EmergencyContactDraft = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

export default function ClientProfiel() {
  const { goBack, emergencyContacts, upsertEmergencyContact, deleteEmergencyContact } = useClientProfiel();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EmergencyContactDraft>({
    id: "",
    name: "",
    relation: "",
    phone: "",
  });

  const [omgangPreferences, setOmgangPreferences] = useState<string>(
    "Bij onrust: rustig benaderen, 1-op-1 praten. Vermijd drukte. Overleg bij escalatie met begeleider."
  );
  const [isEditingOmgangPreferences, setIsEditingOmgangPreferences] = useState(false);
  const [omgangPreferencesDraft, setOmgangPreferencesDraft] = useState(omgangPreferences);

  const startEditOmgangPreferences = () => {
    setOmgangPreferencesDraft(omgangPreferences);
    setIsEditingOmgangPreferences(true);
  };

  const cancelEditOmgangPreferences = () => {
    setIsEditingOmgangPreferences(false);
    setOmgangPreferencesDraft(omgangPreferences);
  };

  const saveOmgangPreferences = () => {
    setOmgangPreferences(omgangPreferencesDraft.trim());
    setIsEditingOmgangPreferences(false);
  };

  const startEdit = (c: { id: string; name: string; relation: string; phone: string }) => {
    setEditingId(c.id);
    setDraft({ id: c.id, name: c.name, relation: c.relation, phone: c.phone });
  };

  const startAdd = () => {
    setEditingId("__new__");
    setDraft({ id: "", name: "", relation: "", phone: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ id: "", name: "", relation: "", phone: "" });
  };

  const canSave = useMemo(() => {
    return draft.name.trim().length > 0 && draft.relation.trim().length > 0 && draft.phone.trim().length > 0;
  }, [draft.name, draft.relation, draft.phone]);

  const save = () => {
    if (!canSave) return;
    upsertEmergencyContact({
      id: draft.id,
      name: draft.name.trim(),
      relation: draft.relation.trim(),
      phone: draft.phone.trim(),
    });
    cancelEdit();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 w-full mx-auto">
      <div className="bg-primary text-primary-foreground text-center py-4 px-4 flex items-center justify-center relative">
        <button
          onClick={goBack}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Mijn Profiel</h1>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-6 border-b border-border flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-3">
          <span className="text-muted-foreground text-4xl font-medium">PH</span>
        </div>
        <div className="font-bold text-2xl text-foreground mb-1">Peter Hendriks</div>
        <div className="text-sm text-muted-foreground">Cliënt sinds 2023</div>
      </div>

      {/* Personal Information */}
      <SectionBar title="Persoonlijke gegevens" />
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <User size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Volledige naam</div>
            <div className="text-foreground">Peter Hendriks</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Geboortedatum</div>
            <div className="text-foreground">15 maart 2005</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-start gap-3">
          <Notebook size={20} className="text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Voorkeuren omgang</div>

            {!isEditingOmgangPreferences ? (
              <div className="flex items-start justify-between gap-3">
                <div className="text-foreground whitespace-pre-wrap">
                  {omgangPreferences.trim().length > 0 ? omgangPreferences : "—"}
                </div>
                <button
                  onClick={startEditOmgangPreferences}
                  className="px-3 py-2 rounded-md border border-border text-sm shrink-0"
                >
                  Aanpassen
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <textarea
                  value={omgangPreferencesDraft}
                  onChange={(e) => setOmgangPreferencesDraft(e.target.value)}
                  className="w-full min-h-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Bijv. afspraken over omgang, triggers, benadering..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveOmgangPreferences}
                    disabled={omgangPreferencesDraft.trim().length === 0}
                    className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={cancelEditOmgangPreferences}
                    className="px-3 py-2 rounded-md border border-border text-sm"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <SectionBar title="Contactgegevens" />
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">E-mailadres</div>
            <div className="text-foreground">demo@client.nl</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Telefoonnummer</div>
            <div className="text-foreground">06 1234 5678</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Adres</div>
            <div className="text-foreground">Voorbeeldstraat 123</div>
            <div className="text-foreground">1234 AB Amsterdam</div>
          </div>
        </div>
      </div>

      {/* Care Information */}
      <SectionBar title="Zorggegevens" />
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <User size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Hoofdbehandelaar</div>
            <div className="text-foreground">Sophie van der Berg</div>
            <div className="text-sm text-muted-foreground">Begeleider</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <User size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Zorgteam</div>
            <div className="text-foreground">6 gekoppelde zorgmedewerkers</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Laatste afspraak</div>
            <div className="text-foreground">Gisteren, 11:00</div>
            <div className="text-sm text-muted-foreground">Medicatie bespreking</div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <SectionBar title="Noodcontacten" />
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Voeg noodcontacten toe die we mogen bellen bij een noodgeval.
        </div>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          <Plus size={16} />
          Nieuw
        </button>
      </div>

      {editingId === "__new__" && (
        <div className="px-4 py-4 border-b border-border">
          <div className="text-sm font-semibold mb-3">Nieuw noodcontact</div>
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Naam</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Bijv. Maria Hendriks"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Relatie</span>
              <input
                value={draft.relation}
                onChange={(e) => setDraft((d) => ({ ...d, relation: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Bijv. Echtgenote"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-muted-foreground">Telefoonnummer</span>
              <input
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Bijv. 06 1234 5678"
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={save}
              disabled={!canSave}
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
            >
              Opslaan
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-2 rounded-md border border-border text-sm"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {emergencyContacts.length === 0 ? (
        <div className="px-4 py-4 border-b border-border text-sm text-muted-foreground">
          Nog geen noodcontacten toegevoegd.
        </div>
      ) : (
        emergencyContacts.map((c) => {
          const isEditing = editingId === c.id;
          return (
            <div key={c.id} className="border-b border-border">
              {!isEditing ? (
                <div className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="text-foreground font-medium">{c.name}</div>
                      <div className="text-sm text-muted-foreground">{c.relation}</div>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <Phone size={16} className="text-muted-foreground" />
                        <span className="text-foreground">{c.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="px-3 py-2 rounded-md border border-border text-sm"
                      >
                        Aanpassen
                      </button>
                      <button
                        onClick={() => deleteEmergencyContact(c.id)}
                        className="p-2 rounded-md border border-border text-sm"
                        aria-label="Verwijderen"
                        title="Verwijderen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4">
                  <div className="text-sm font-semibold mb-3">Noodcontact aanpassen</div>
                  <div className="grid gap-3">
                    <label className="grid gap-1">
                      <span className="text-xs text-muted-foreground">Naam</span>
                      <input
                        value={draft.name}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs text-muted-foreground">Relatie</span>
                      <input
                        value={draft.relation}
                        onChange={(e) => setDraft((d) => ({ ...d, relation: e.target.value }))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs text-muted-foreground">Telefoonnummer</span>
                      <input
                        value={draft.phone}
                        onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={save}
                      disabled={!canSave}
                      className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 rounded-md border border-border text-sm"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      <ClientBottomNav />
    </div>
  );
}
