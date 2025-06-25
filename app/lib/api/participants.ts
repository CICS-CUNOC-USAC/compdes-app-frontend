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
  createdAt: Date;
}

export interface RegistrationStatus extends Entity {
  isApproved: boolean;
  id: string;
  isCashPayment: boolean;
  voucherNumber: null;
}

export async function getMyProfile() {
  const response = await $api(`/participants/my-profile`, {
    method: "GET",
  });
  return response;
}
