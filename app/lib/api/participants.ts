import type { Entity } from "./shared";

export interface InscriptionsResponse {
  content: Participant[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Participant extends Entity {
  firstName: string;
  lastName: string;
  organisation: string;
  isAuthor: boolean;
  isGuest: boolean;
  email: string;
  phone: string;
  identificationDocument: string;
  qrCodeLink: null;
  id: string;
  registrationStatus: RegistrationStatus;
  isTransferPayment: boolean;
  isCardPayment: boolean;
  cardPaymentProofLink: string;
  transferPaymentProofLink: null;
  created_at: Date;
}

export interface RegistrationStatus extends Entity {
  isApproved: boolean;
  id: string;
  isCashPayment: boolean;
  voucherNumber: null;
}
