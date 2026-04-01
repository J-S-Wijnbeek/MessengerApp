Update and extend the ZorgConnect app design with the following changes:

---

LOGIN SCREEN:
- Remove the "ZorgConnect" navigation/header block above login form
- Keep teal header with logo only
- Pill toggle: "Cliënt | Medewerker" — both must be functional/demoable
- Demo credentials shown small below button:
  Client: "demo@client.nl / 1234"
  Staff: "demo@medewerker.nl / 1234"

---

CLIENT FLOW CHANGES:

HOME (client) — update:
- Remove floating SOS button from home screen entirely
- Add SOS as tab in bottom navigation: 
  Home | Berichten | Agenda | SOS | Instellingen
- "Mijn Favorieten" section → rename to "Gekoppelde Zorgmedewerkers"
  * Shows ONLY assigned care workers (max 10)
  * Each card: avatar, name, role, colored status dot
- Availability section restructure:
  * First show ONLY coupled care workers with status
    (Beschikbaar/Achterwacht/Niet beschikbaar rows)
  * Below that: collapsible row "Overige medewerkers ▾"
    collapsed by default, grey chevron, tap to expand
    shows all other team members in same row style

NEW — AGENDA SCREEN (client):
- Teal header: "Mijn Agenda"
- Pill toggle: "Aankomend | Afgelopen"
- Section bar "Vandaag": 
  * Appointment cards: time (bold), 
    type "Belafspraak 📞" or "Gesprek 💬",
    medewerker name + avatar, 
    orange "Bel nu" button if time is now
- Section bar "Later":
  * Same card style, upcoming days with date labels
- Empty state: grey text "Geen geplande afspraken"
- Orange FAB: + icon (request new appointment)

NEW — INSTELLINGEN SCREEN (client):
- Teal header: "Instellingen"
- Profile row: avatar, name, orange "Bewerk" link
- Section bar "Meldingen":
  * Berichten toggle, Afspraken toggle, SOS bevestiging toggle
- Section bar "Beveiliging":
  * Wachtwoord wijzigen row, chevron ›
  * Face ID / vingerafdruk toggle
- Section bar "Toegankelijkheid":
  * Grote tekst toggle
  * Hoog contrast toggle
- "Uitloggen" red text bottom

BERICHTEN (client) — update:
- Add orange FAB bottom-right: 💬 + icon
- Tap FAB → bottom sheet slides up:
  * Title: "Nieuw bericht"
  * Search field: "Zoek zorgmedewerker..."
  * List of coupled care workers: 
    avatar, name, status dot, "Start chat" button right
  * Hairline dividers

SOS SCREEN (client) — update:
- "Annuleren" button navigates back to HOME screen
- SOS is now a tab in bottom nav, not a floating button

---

STAFF FLOW CHANGES:

NEW — HOME SCREEN (staff):
- Teal header: org name + "Goedemiddag, [Naam]"
- Status card at top: 
  current dienst status pill (Beschikbaar/Achterwacht/Niet beschikbaar)
  toggle inline, teal when active
- Section bar "Noodoproepen actief":
  red background, only shown if SOS active
  pulsing row: client name, address, red "Bekijk" button
- Section bar "Mijn Cliënten":
  list rows: avatar/initials, name, address grey, 
  last contact timestamp, message + call icon buttons right
  red SOS badge on row if client has active emergency
- Section bar "Mijn Dienst":
  today's shift time large bold, "15:00 — 23:00"
  orange "Achterwacht" badge if applicable
- Bottom nav: Home | Plannen | Berichten | Gesprekken | Instellingen

GESPREKKEN (staff) — update:
- "Alles" tab: only own calls/messages, 
  small grey label: "Alleen jouw eigen gesprekken"
- "Gemist" tab: own missed + linked clients missed,
  linked-client rows get subtle orange tint background (#FFF4E0)
  + grey "Gekoppeld aan jou" sublabel
- Add section bar "Noodoproepen" (red #D9534F background):
  each row: red shield icon, orange client name,
  "Vandaag 14:32" timestamp,
  "Opgepakt door: MJ — Maria de Jonge" grey subtext,
  green checkmark = resolved / orange clock = in progress
  Empty state: "Geen noodoproepen geregistreerd"

PLANNEN (staff) — make interactive:
- Pill toggle "Ik | Iedereen" both functional:
  "Ik": shows only logged-in staff member's own shifts
  "Iedereen": shows all team members' shifts,
  each shift row shows staff avatar + name above time
- Shift rows tappable → detail sheet slides up:
  shift date, time, type, option to edit or delete
- Orange FAB: + adds new shift

INSTELLINGEN (staff) — Cliënten koppelen functional:
- Capacity bar: teal filled segments, 
  label "7 van 10 cliënten gekoppeld"
  amber warning at 9/10, red "Maximum bereikt" at 10/10
- Each linked client as full row:
  avatar/initials, name, address grey,
  red outlined "× Ontkoppel" button right
  confirm dialog on tap
- "+ Koppel nieuwe cliënt" orange full-width button:
  opens bottom search sheet:
  search field, list of unlinked clients,
  tap row → inline orange "Koppel" button,
  after link: teal checkmark, capacity bar updates,
  button disabled + greyed at 10/10

---

GLOBAL RULES:
- Teal (#1DC6B4) headers, orange (#F5A623) FAB + accents
- Red (#D9534F) SOS/urgent elements only
- White body, hairline grey dividers
- Section bars: teal bg + white bold centered text
- List rows: avatar left, text center, action/chevron right
- iPhone 14 Pro 390x844px, light mode, safe areas
- Both client and staff flows fully demoable from login toggle