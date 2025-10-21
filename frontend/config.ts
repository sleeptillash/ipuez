export const semester = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
  { value: "3", label: "Semester 3" },
  { value: "4", label: "Semester 4" },
  { value: "5", label: "Semester 5" },
  { value: "6", label: "Semester 6" },
  { value: "7", label: "Semester 7" },
  { value: "8", label: "Semester 8" },
];

export const branch = [
  { value: "CSE", label: "CSE" },
  { value: "AIML", label: "AIML" },
  { value: "AIDS", label: "AIDS" },
  { value: "CSAM", label: "CSAM" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "IIOT", label: "IIOT" },
  { value: "IT", label: "IT" },
];

export enum Tab {
  THEORY = "THEORY",
  LAB = "LAB",
  NOTES = "NOTES",
  PYQ = "PYQ",
  BOOKS = "BOOKS",
  FILES = "FILES",
  PDF = "PDF",
}

export const Semesters = {
  "1": "firstsemesters",
  "2": "secondsemesters",
  "3": "thirdsemesters",
  "4": "fourthsemesters",
  "5": "fifthsemesters",
  "6": "sixthsemesters",
  "7": "seventhsemesters",
  "8": "eighthsemesters",
} as const;

export enum Departments {
  CSE = "CSE",
  IT = "IT",
  CST = "CST",
  ITE = "ITE",
  ECE = "ECE",
  EE = "EE",
  EEE = "EEE",
  ICE = "ICE",
  ME = "ME",
  CE = "CE",
  MAE = "MAE",
}

export type SubjectSearchResult = {
  subject: string;
  camelCase: string;
  
  department: Departments[] | null;
  theoryCode: string | null;
  labCode: string | null;
  theoryCredits: number | null;
  labCredits: number | null;
  matches: {
    field: string;
    snippet: string;
  }[];
};

export const server = "https://server.syllabusx.live/";
// export const server = "http://localhost:8080/";

export const STALE_TIME = 1000 * 60 * 60 * 24 * 15; // 15 days in ms
export const CACHE_TIME = 1000 * 60 * 60 * 24 * 15; // 15 days in ms
