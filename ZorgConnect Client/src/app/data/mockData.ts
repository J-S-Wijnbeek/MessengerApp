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
  {
    id: 6,
    name: "Nikki Nijboer",
    role: "Verpleegkundige",
    status: "beschikbaar" as const,
    distance: "2.0km",
    time: "8min",
    clients: 4,
    maxClients: 10,
  },
  {
    id: 7,
    name: "Ekin Kuru",
    role: "Verpleegkundige",
    status: "achterwacht" as const,
    distance: "3.1km",
    time: "11min",
    clients: 6,
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
  {
    id: 5,
    name: "Nikki Nijboer",
    role: "Verpleegkundige",
    status: "beschikbaar" as const,
    distance: "2.0km",
    time: "8min",
  },
  {
    id: 6,
    name: "Ekin Kuru",
    role: "Verpleegkundige",
    status: "achterwacht" as const,
    distance: "3.1km",
    time: "11min",
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
  },
  {
    id: 2,
    name: "Lisa de Jong",
    initials: "LJ",
    lastContact: "Vandaag, 12:15",
    hasActiveSOS: false,
  },
  {
    id: 3,
    name: "Marco Visser",
    initials: "MV",
    lastContact: "Vandaag, 11:45",
    hasActiveSOS: false,
  },
  {
    id: 4,
    name: "Anna Bakker",
    initials: "AB",
    lastContact: "Gisteren, 16:20",
    hasActiveSOS: false,
  },
  {
    id: 5,
    name: "Tom Jansen",
    initials: "TJ",
    lastContact: "Gisteren, 09:30",
    hasActiveSOS: false,
  },
  {
    id: 6,
    name: "Sarah de Vries",
    initials: "SV",
    lastContact: "2 dagen geleden",
    hasActiveSOS: false,
  },
  {
    id: 7,
    name: "David Smit",
    initials: "DS",
    lastContact: "3 dagen geleden",
    hasActiveSOS: false,
  },
];

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
    isoDate: "2026-04-01",
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
    isoDate: "2026-04-01",
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
    isoDate: "2026-03-31",
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
    isoDate: "2026-04-01",
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
    isoDate: "2026-03-31",
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
    isoDate: "2026-03-23",
    time: "09:00",
    title: "Weekstart gesprek",
    type: "gesprek" as const,
    location: "Kantoor",
    staffName: "Sophie van der Berg",
    isPast: true,
    isNow: false,
  },
  {
    id: 7,
    isoDate: "2026-04-02",
    time: "09:30",
    title: "Controle medicatie",
    type: "gesprek" as const,
    location: "Kantoor",
    staffName: "Jeroen Bakker",
    isPast: false,
    isNow: false,
  },
  {
    id: 8,
    isoDate: "2026-04-03",
    time: "13:00",
    title: "Telefonisch overleg",
    type: "call" as const,
    location: "Telefoon",
    staffName: "Emma Jansen",
    isPast: false,
    isNow: false,
  },
  {
    id: 9,
    isoDate: "2026-04-08",
    time: "16:15",
    title: "Evaluatiegesprek",
    type: "gesprek" as const,
    location: "Kantoor",
    staffName: "Sophie van der Berg",
    isPast: false,
    isNow: false,
  },
  {
    id: 10,
    isoDate: "2026-04-15",
    time: "11:45",
    title: "Korte check-in",
    type: "call" as const,
    location: "Telefoon",
    staffName: "Lucas de Vries",
    isPast: false,
    isNow: false,
  },
];

export type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  updatedAt: string; // ISO string
};

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: "ec-1",
    name: "Maria Hendriks",
    relation: "Moeder",
    phone: "06 9876 5432",
    updatedAt: "2026-03-31T09:00:00.000Z",
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
  "2026-04-05": {
    ochtend: {
      available: 2,
      staff: ["Jeroen Bakker", "Emma Jansen"],
    },
    middag: {
      available: 1,
      staff: ["Sophie van der Berg"],
    },
    avond: {
      available: 3,
      staff: ["Sophie van der Berg", "Lucas de Vries", "Emma Jansen"],
    },
  },
  "2026-04-06": {
    ochtend: {
      available: 0,
      staff: [],
    },
    middag: {
      available: 2,
      staff: ["Jeroen Bakker", "Lucas de Vries"],
    },
    avond: {
      available: 1,
      staff: ["Sophie van der Berg"],
    },
  },
  "2026-04-07": {
    ochtend: {
      available: 3,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen"],
    },
    middag: {
      available: 1,
      staff: ["Emma Jansen"],
    },
    avond: {
      available: 2,
      staff: ["Jeroen Bakker", "Lucas de Vries"],
    },
  },
  "2026-04-08": {
    ochtend: {
      available: 1,
      staff: ["Lucas de Vries"],
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
  "2026-04-09": {
    ochtend: {
      available: 2,
      staff: ["Sophie van der Berg", "Jeroen Bakker"],
    },
    middag: {
      available: 0,
      staff: [],
    },
    avond: {
      available: 2,
      staff: ["Emma Jansen", "Lucas de Vries"],
    },
  },
  "2026-04-10": {
    ochtend: {
      available: 4,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen", "Lucas de Vries"],
    },
    middag: {
      available: 2,
      staff: ["Jeroen Bakker", "Emma Jansen"],
    },
    avond: {
      available: 0,
      staff: [],
    },
  },
  "2026-04-11": {
    ochtend: {
      available: 1,
      staff: ["Emma Jansen"],
    },
    middag: {
      available: 2,
      staff: ["Sophie van der Berg", "Lucas de Vries"],
    },
    avond: {
      available: 1,
      staff: ["Jeroen Bakker"],
    },
  },
  "2026-04-12": {
    ochtend: {
      available: 0,
      staff: [],
    },
    middag: {
      available: 1,
      staff: ["Sophie van der Berg"],
    },
    avond: {
      available: 2,
      staff: ["Emma Jansen", "Lucas de Vries"],
    },
  },
  "2026-04-13": {
    ochtend: {
      available: 2,
      staff: ["Jeroen Bakker", "Lucas de Vries"],
    },
    middag: {
      available: 3,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen"],
    },
    avond: {
      available: 1,
      staff: ["Sophie van der Berg"],
    },
  },
  "2026-04-14": {
    ochtend: {
      available: 1,
      staff: ["Sophie van der Berg"],
    },
    middag: {
      available: 0,
      staff: [],
    },
    avond: {
      available: 3,
      staff: ["Jeroen Bakker", "Emma Jansen", "Lucas de Vries"],
    },
  },
  "2026-04-15": {
    ochtend: {
      available: 3,
      staff: ["Sophie van der Berg", "Jeroen Bakker", "Emma Jansen"],
    },
    middag: {
      available: 2,
      staff: ["Emma Jansen", "Lucas de Vries"],
    },
    avond: {
      available: 1,
      staff: ["Jeroen Bakker"],
    },
  },
  "2026-04-16": {
    ochtend: {
      available: 2,
      staff: ["Sophie van der Berg", "Lucas de Vries"],
    },
    middag: {
      available: 1,
      staff: ["Jeroen Bakker"],
    },
    avond: {
      available: 2,
      staff: ["Emma Jansen", "Sophie van der Berg"],
    },
  },
};

export type MockMedication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  purpose: string;
  startDate: string;
};

export const mockMedications: MockMedication[] = [
  {
    id: 1,
    name: "Sertraline",
    dosage: "50 mg",
    frequency: "1x daags (ochtend)",
    prescribedBy: "Emma Jansen",
    purpose: "Angststoornis / Depressie",
    startDate: "2026-01-15",
  },
  {
    id: 2,
    name: "Melatonine",
    dosage: "3 mg",
    frequency: "1x daags (voor het slapen)",
    prescribedBy: "Jeroen Bakker",
    purpose: "Slaapproblemen",
    startDate: "2026-02-10",
  },
  {
    id: 3,
    name: "Methylfenidaat",
    dosage: "10 mg",
    frequency: "2x daags (ochtend en middag)",
    prescribedBy: "Emma Jansen",
    purpose: "Concentratie (ADHD)",
    startDate: "2025-11-01",
  },
  {
    id: 4,
    name: "Lorazepam",
    dosage: "0,5 mg",
    frequency: "Zo nodig (max. 1x daags)",
    prescribedBy: "Emma Jansen",
    purpose: "Acute angst / paniekaanvallen",
    startDate: "2026-03-01",
  },
];

export type MockAppointmentRequest = {
  id: string;
  date: string; // YYYY-MM-DD
  timeOfDay: "ochtend" | "middag" | "avond" | "geen-voorkeur";
  notes: string;
  createdByName: string;
  createdAt: string;
};

export const mockAppointmentRequests: MockAppointmentRequest[] = [
  {
    id: "mock-1",
    date: "2026-04-02",
    timeOfDay: "middag",
    notes: "Test 2",
    createdByName: "Peter Hendriks",
    createdAt: "2026-03-31T11:41:02.763Z",
  },
  {
    id: "mock-2",
    date: "2026-04-03",
    timeOfDay: "avond",
    notes: "test",
    createdByName: "Peter Hendriks",
    createdAt: "2026-03-31T11:39:39.098Z",
  },
  {
    id: "mock-3",
    date: "2026-04-16",
    timeOfDay: "geen-voorkeur",
    notes: "",
    createdByName: "Peter Hendriks",
    createdAt: "2026-03-31T19:43:25.252Z",
  },
];