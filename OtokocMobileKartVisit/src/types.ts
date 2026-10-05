// Kartvizitten okunan bilgiler
export type BusinessCard = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  department: string;
  mobilePhone: string;
  workPhone: string;
  email: string;
  website: string;
  address: string;
};

export const emptyCard: BusinessCard = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  department: '',
  mobilePhone: '',
  workPhone: '',
  email: '',
  website: '',
  address: '',
};

export type ScanResult = {
  card: BusinessCard;
  photoUri: string;
};
