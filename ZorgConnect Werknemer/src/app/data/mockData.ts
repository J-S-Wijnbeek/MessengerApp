export const mockStaff = [
  {
    id: 1,
    name: "Sophie van der Berg",
    role: "Begeleider",
    status: "beschikbaar" as const,
    distance: "1.2km",
    time: "5min",
    clients: 7,
    maxClients: 10,
  },
  {
    id: 2,
    name: "Jeroen Bakker",
    role: "Verpleegkundige",
    status: "beschikbaar" as const,
    distance: "2.5km",
    time: "10min",
    clients: 5,
    maxClients: 10,
  },
  {
    id: 3,
    name: "Emma Jansen",
    role: "Psycholoog",
    status: "achterwacht" as const,
    distance: "5.1km",
    time: "15min",
    clients: 8,
    maxClients: 10,
  },
  {
    id: 4,
    name: "Lucas de Vries",
    role: "Begeleider",
    status: "achterwacht" as const,
    distance: "4.8km",
    time: "12min",
    clients: 6,
    maxClients: 10,
  },
  {
    id: 5,
    name: "Anna Smit",
    role: "Verpleegkundige",
    status: "niet-beschikbaar" as const,
    distance: "N/A",
    time: "N/A",
    clients: 9,
    maxClients: 10,
  },
];

export const mockClients = [
  {
    id: 1,
    name: "Peter Hendriks",
    lastMessage: "Dank je wel voor het gesprek vandaag",
    timestamp: "14:30",
    unread: 2,
  },
  {
    id: 2,
    name: "Lisa de Jong",
    lastMessage: "Tot morgen!",
    timestamp: "12:15",
    unread: 0,
  },
  {
    id: 3,
    name: "Marco Visser",
    lastMessage: "Kan ik je even bellen?",
    timestamp: "11:45",
    unread: 1,
  },
];

export const mockCalls = [
  {
    id: 1,
    clientName: "Peter Hendriks",
    type: "beantwoord" as const,
    timestamp: "14:45",
    status: "Beantwoord door jou",
  },
  {
    id: 2,
    clientName: "Lisa de Jong",
    type: "gemist" as const,
    timestamp: "13:20",
    status: "Nog af te handelen",
  },
  {
    id: 3,
    clientName: "Marco Visser",
    type: "beantwoord" as const,
    timestamp: "11:30",
    status: "Beantwoord door jou",
  },
];

export const mockSchedule = [
  {
    id: 1,
    date: "Vandaag",
    startTime: "15:00",
    endTime: "23:00",
    isAchterwacht: false,
  },
  {
    id: 2,
    date: "Dinsdag 31 Maart",
    startTime: "08:00",
    endTime: "16:00",
    isAchterwacht: false,
  },
  {
    id: 3,
    date: "Woensdag 1 April",
    startTime: "00:00",
    endTime: "08:00",
    isAchterwacht: true,
  },
];

export const mockLinkedClients = [
  "Peter Hendriks",
  "Lisa de Jong",
  "Marco Visser",
  "Anna Bakker",
  "Tom Jansen",
  "Sarah de Vries",
  "David Smit",
];

export const mockCoupledCareWorkers = [
  {
    id: 1,
    name: "Sophie van der Berg",
    role: "Begeleider",
    status: "beschikbaar" as const,
    distance: "1.2km",
    time: "5min",
  },
  {
    id: 2,
    name: "Jeroen Bakker",
    role: "Verpleegkundige",
    status: "beschikbaar" as const,
    distance: "2.5km",
    time: "10min",
  },
  {
    id: 3,
    name: "Emma Jansen",
    role: "Psycholoog",
    status: "achterwacht" as const,
    distance: "5.1km",
    time: "15min",
  },
  {
    id: 4,
    name: "Lucas de Vries",
    role: "Begeleider",
    status: "niet-beschikbaar" as const,
    distance: "N/A",
    time: "N/A",
  },
];

export const mockOtherStaff = [
  {
    id: 5,
    name: "Anna Smit",
    role: "Verpleegkundige",
    status: "beschikbaar" as const,
    distance: "3.5km",
    time: "12min",
  },
  {
    id: 6,
    name: "Peter de Wit",
    role: "Begeleider",
    status: "achterwacht" as const,
    distance: "6.2km",
    time: "18min",
  },
  {
    id: 7,
    name: "Maria Visser",
    role: "Psycholoog",
    status: "niet-beschikbaar" as const,
    distance: "N/A",
    time: "N/A",
  },
];

export const mockLinkedClientsDetailed = [
  {
    id: 1,
    name: "Peter Hendriks",
    initials: "PH",
    lastContact: "Vandaag, 14:30",
    hasActiveSOS: false,
    dateOfBirth: "15-03-1989",
    address: "Hoofdstraat 123, Amsterdam",
    phone: "06-12345678",
    email: "p.hendriks@email.nl",
    diagnosis: "Depressieve stoornis",
    since: "Januari 2025",
    primaryCareWorker: "Sophie van der Berg",
    notes: "Wekelijks contact, medicatie check elke maand",
  },
  {
    id: 2,
    name: "Lisa de Jong",
    initials: "LJ",
    lastContact: "Vandaag, 12:15",
    hasActiveSOS: false,
    dateOfBirth: "22-07-1995",
    address: "Kerkstraat 45, Utrecht",
    phone: "06-98765432",
    email: "l.dejong@email.nl",
    diagnosis: "Angststoornis",
    since: "Maart 2025",
    primaryCareWorker: "Emma Jansen",
    notes: "Groepstherapie op dinsdag en donderdag",
  },
  {
    id: 3,
    name: "Marco Visser",
    initials: "MV",
    lastContact: "Vandaag, 11:45",
    hasActiveSOS: false,
    dateOfBirth: "08-11-1982",
    address: "Dorpsweg 78, Rotterdam",
    phone: "06-55544433",
    email: "m.visser@email.nl",
    diagnosis: "Bipolaire stoornis",
    since: "Oktober 2024",
    primaryCareWorker: "Jeroen Bakker",
    notes: "Maandelijks psychiater consult",
  },
  {
    id: 4,
    name: "Anna Bakker",
    initials: "AB",
    lastContact: "Gisteren, 16:20",
    hasActiveSOS: false,
    dateOfBirth: "30-05-1991",
    address: "Parkweg 12, Den Haag",
    phone: "06-77788899",
    email: "a.bakker@email.nl",
    diagnosis: "PTSS",
    since: "December 2024",
    primaryCareWorker: "Sophie van der Berg",
    notes: "EMDR therapie wekelijks",
  },
  {
    id: 5,
    name: "Tom Jansen",
    initials: "TJ",
    lastContact: "Gisteren, 09:30",
    hasActiveSOS: false,
    dateOfBirth: "19-01-1987",
    address: "Lindenlaan 56, Eindhoven",
    phone: "06-33322211",
    email: "t.jansen@email.nl",
    diagnosis: "Persoonlijkheidsstoornis NOS",
    since: "Februari 2025",
    primaryCareWorker: "Lucas de Vries",
    notes: "Dagbesteding op maandag, woensdag en vrijdag",
  },
  {
    id: 6,
    name: "Sarah de Vries",
    initials: "SV",
    lastContact: "2 dagen geleden",
    hasActiveSOS: false,
    dateOfBirth: "14-09-1993",
    address: "Molenstraat 89, Groningen",
    phone: "06-11122233",
    email: "s.devries@email.nl",
    diagnosis: "Obsessief-compulsieve stoornis",
    since: "September 2024",
    primaryCareWorker: "Emma Jansen",
    notes: "Cognitieve gedragstherapie",
  },
  {
    id: 7,
    name: "David Smit",
    initials: "DS",
    lastContact: "3 dagen geleden",
    hasActiveSOS: false,
    dateOfBirth: "27-12-1990",
    address: "Schoolstraat 34, Tilburg",
    phone: "06-99988877",
    email: "d.smit@email.nl",
    diagnosis: "Schizofrenie",
    since: "Juni 2024",
    primaryCareWorker: "Jeroen Bakker",
    notes: "Medicatiebegeleiding, tweewekelijks contact",
  },
];

// Mock chat messages for each client
export const mockChatMessages: Record<number, {
  id: number;
  senderId: number;
  senderType: 'client' | 'staff';
  message: string;
  timestamp: string;
  read: boolean;
}[]> = {
  1: [
    { id: 1, senderId: 1, senderType: 'client', message: 'Goedemiddag Sophie, ik wilde even laten weten dat de nieuwe medicatie goed aanslaat.', timestamp: '14:20', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Dat is fijn om te horen Peter! Ervaar je nog bijwerkingen?', timestamp: '14:22', read: true },
    { id: 3, senderId: 1, senderType: 'client', message: 'Nee eigenlijk niet. Ik voel me rustiger en kan beter slapen.', timestamp: '14:23', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Mooi! Blijf het bijhouden in je dagboek zoals we besproken hebben. Morgen om 10:00 uur zie ik je weer.', timestamp: '14:25', read: true },
    { id: 5, senderId: 1, senderType: 'client', message: 'Zal ik doen. Bedankt voor je steun.', timestamp: '14:30', read: false },
    { id: 6, senderId: 1, senderType: 'client', message: 'De ademhalingsoefeningen helpen ook echt goed!', timestamp: '14:31', read: false },
  ],
  2: [
    { id: 1, senderId: 2, senderType: 'client', message: 'Hallo Emma, ik ben een beetje nerveus voor de groepstherapie morgen', timestamp: '12:05', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Dat is heel begrijpelijk Lisa. Wat maakt je het meest nerveus?', timestamp: '12:08', read: true },
    { id: 3, senderId: 2, senderType: 'client', message: 'Vooral het delen van mijn ervaringen met anderen die ik niet ken', timestamp: '12:10', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Je hoeft alleen te delen wat je zelf wilt. Iedereen zit in hetzelfde schuitje en begrijpt wat je doormaakt.', timestamp: '12:12', read: true },
    { id: 5, senderId: 2, senderType: 'client', message: 'Oké, dat helpt. Ik ga het gewoon proberen.', timestamp: '12:15', read: true },
  ],
  3: [
    { id: 1, senderId: 3, senderType: 'client', message: 'Jeroen, ik heb afgelopen nacht weinig geslapen', timestamp: '11:30', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Vervelend om te horen Marco. Heb je last van je gedachten of moeite met inslapen?', timestamp: '11:32', read: true },
    { id: 3, senderId: 3, senderType: 'client', message: 'Mijn gedachten bleven maar rondmalen. Het voelde alsof ze niet stoppen.', timestamp: '11:35', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Dat klinkt als een manische periode. Heb je je stemmingsdagboek bijgehouden?', timestamp: '11:38', read: true },
    { id: 5, senderId: 3, senderType: 'client', message: 'Ja, ik zie inderdaad een patroon. Kan ik vandaag nog langskomen?', timestamp: '11:45', read: false },
  ],
  4: [
    { id: 1, senderId: 4, senderType: 'client', message: 'Sophie, de EMDR sessie van gisteren was zwaar', timestamp: '16:10', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Dat kan ik me voorstellen Anna. Het verwerken van trauma kost veel energie. Hoe voel je je nu?', timestamp: '16:13', read: true },
    { id: 3, senderId: 4, senderType: 'client', message: 'Moe, maar ook wel opgelucht. Alsof er iets is losgemaakt', timestamp: '16:15', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Dat is een goed teken. Rust goed uit vandaag en wees lief voor jezelf. Bel me als het nodig is.', timestamp: '16:18', read: true },
    { id: 5, senderId: 4, senderType: 'client', message: 'Dank je, dat betekent veel voor me', timestamp: '16:20', read: true },
  ],
  5: [
    { id: 1, senderId: 5, senderType: 'client', message: 'Lucas, de dagbesteding ging vandaag echt goed!', timestamp: '09:20', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Wat fijn om te horen Tom! Wat heb je gedaan?', timestamp: '09:23', read: true },
    { id: 3, senderId: 5, senderType: 'client', message: 'We hebben gewerkt aan sociale vaardigheden en ik heb meegedaan met de groepsdiscussie', timestamp: '09:25', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Dat is een grote stap voor je! Je bent goed bezig.', timestamp: '09:28', read: true },
    { id: 5, senderId: 5, senderType: 'client', message: 'Morgen ga ik weer. Ik merk dat het echt helpt', timestamp: '09:30', read: true },
  ],
  6: [
    { id: 1, senderId: 6, senderType: 'client', message: 'Emma, mijn dwanggedachten zijn deze week erger geworden', timestamp: '28 mrt 14:30', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Dank je voor het delen Sarah. Kun je beschrijven wat er is veranderd?', timestamp: '28 mrt 14:35', read: true },
    { id: 3, senderId: 6, senderType: 'client', message: 'Ik moet veel vaker controleren en het duurt langer voordat ik kan stoppen', timestamp: '28 mrt 14:38', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Is er iets gebeurd of voelde je je extra gestrest?', timestamp: '28 mrt 14:42', read: true },
    { id: 5, senderId: 6, senderType: 'client', message: 'Werk was druk. Misschien heeft dat ermee te maken', timestamp: '28 mrt 14:45', read: true },
  ],
  7: [
    { id: 1, senderId: 7, senderType: 'client', message: 'Jeroen, ik heb mijn medicatie van vanmorgen ingenomen', timestamp: '27 mrt 09:15', read: true },
    { id: 2, senderId: 0, senderType: 'staff', message: 'Goed gedaan David! Hoe gaat het verder met je?', timestamp: '27 mrt 09:20', read: true },
    { id: 3, senderId: 7, senderType: 'client', message: 'Redelijk stabiel. Geen stemmen gehoord deze week', timestamp: '27 mrt 09:25', read: true },
    { id: 4, senderId: 0, senderType: 'staff', message: 'Dat is heel positief! Blijf je medicatie trouw innemen en laat het weten als er iets verandert.', timestamp: '27 mrt 09:30', read: true },
  ],
};

export const mockUnlinkedClients = [
  {
    id: 8,
    name: "Robin Mulder",
    initials: "RM",
    status: "Actief",
  },
  {
    id: 9,
    name: "Eva Vermeulen",
    initials: "EV",
    status: "Actief",
  },
  {
    id: 10,
    name: "Thijs Hoekstra",
    initials: "TH",
    status: "Actief",
  },
  {
    id: 11,
    name: "Nina Bos",
    initials: "NB",
    status: "Actief",
  },
  {
    id: 12,
    name: "Lars Peters",
    initials: "LP",
    status: "Actief",
  },
];

export const mockSOSAlerts = [
  {
    id: 1,
    clientName: "Peter Hendriks",
    timestamp: "14:52",
    status: "Actief",
    duration: "2 min geleden",
  },
];

export const mockSOSHistory = [
  {
    id: 1,
    clientName: "Peter Hendriks",
    clientInitials: "P. Hendriks",
    timestamp: "14:52",
    resolvedAt: "14:58",
    resolvedBy: "Jij",
    handledByInitials: "JIJ",
    duration: "6 min",
    status: "Afgehandeld" as const,
  },
  {
    id: 2,
    clientName: "Lisa de Jong",
    clientInitials: "L. de Jong",
    timestamp: "13:15",
    resolvedAt: "13:20",
    resolvedBy: "Sophie van der Berg",
    handledByInitials: "S.B.",
    duration: "5 min",
    status: "Afgehandeld" as const,
  },
  {
    id: 3,
    clientName: "Marco Visser",
    clientInitials: "M. Visser",
    timestamp: "11:30",
    resolvedAt: "11:35",
    resolvedBy: "Jij",
    handledByInitials: "JIJ",
    duration: "5 min",
    status: "Afgehandeld" as const,
  },
  {
    id: 4,
    clientName: "Anna Bakker",
    clientInitials: "A. Bakker",
    timestamp: "Gisteren, 18:45",
    resolvedAt: "18:52",
    resolvedBy: "Jeroen Bakker",
    handledByInitials: "J.B.",
    duration: "7 min",
    status: "Afgehandeld" as const,
  },
];

export const mockAppointments = [
  {
    id: 1,
    date: "Vandaag",
    time: "15:00",
    title: "Gesprek met Sophie",
    type: "gesprek" as const,
    location: "Kantoor",
    staffName: "Sophie van der Berg",
    isPast: false,
    isNow: false,
  },
  {
    id: 2,
    date: "Vandaag",
    time: "17:30",
    title: "Groepstherapie",
    type: "gesprek" as const,
    location: "Groepsruimte A",
    staffName: "Emma Jansen",
    isPast: false,
    isNow: true,
  },
  {
    id: 3,
    date: "Dinsdag 31 Maart",
    time: "10:00",
    title: "Intake gesprek",
    type: "call" as const,
    location: "Telefoon",
    staffName: "Jeroen Bakker",
    isPast: false,
    isNow: false,
  },
  {
    id: 4,
    date: "Woensdag 1 April",
    time: "14:00",
    title: "Check-in",
    type: "call" as const,
    location: "Telefoon",
    staffName: "Sophie van der Berg",
    isPast: false,
    isNow: false,
  },
  {
    id: 5,
    date: "Gisteren",
    time: "11:00",
    title: "Medicatie bespreking",
    type: "gesprek" as const,
    location: "Kantoor",
    staffName: "Lucas de Vries",
    isPast: true,
    isNow: false,
  },
  {
    id: 6,
    date: "Maandag 23 Maart",
    time: "09:00",
    title: "Weekstart gesprek",
    type: "gesprek" as const,
    location: "Kantoor",
    staffName: "Sophie van der Berg",
    isPast: true,
    isNow: false,
  },
];

// Mock availability data for appointment scheduling
// Each date string maps to availability per time of day
export const mockAvailability: Record<string, {
  ochtend: { available: number; staff: string[] };
  middag: { available: number; staff: string[] };
  avond: { available: number; staff: string[] };
}> = {
  "2026-03-31": {
    ochtend: {
      available: 3,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen"],
    },
    middag: {
      available: 2,
      staff: ["Sophie van der Berg", "Lucas de Vries"],
    },
    avond: {
      available: 1,
      staff: ["Emma Jansen"],
    },
  },
  "2026-04-01": {
    ochtend: {
      available: 2,
      staff: ["Jeroen Bakker", "Lucas de Vries"],
    },
    middag: {
      available: 3,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen"],
    },
    avond: {
      available: 2,
      staff: ["Sophie van der Berg", "Emma Jansen"],
    },
  },
  "2026-04-02": {
    ochtend: {
      available: 4,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen", "Lucas de Vries"],
    },
    middag: {
      available: 2,
      staff: ["Jeroen Bakker", "Emma Jansen"],
    },
    avond: {
      available: 1,
      staff: ["Lucas de Vries"],
    },
  },
  "2026-04-03": {
    ochtend: {
      available: 1,
      staff: ["Emma Jansen"],
    },
    middag: {
      available: 3,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Lucas de Vries"],
    },
    avond: {
      available: 2,
      staff: ["Sophie van der Berg", "Jeroen Bakker"],
    },
  },
  "2026-04-04": {
    ochtend: {
      available: 2,
      staff: ["Sophie van der Berg", "Lucas de Vries"],
    },
    middag: {
      available: 4,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen", "Lucas de Vries"],
    },
    avond: {
      available: 1,
      staff: ["Emma Jansen"],
    },
  },
};