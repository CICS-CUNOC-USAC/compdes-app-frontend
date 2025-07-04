import type { Entity } from "../shared";

export interface Inscription extends Entity {
  firstName: string;
  lastName: string;
  organisation: string;
  isAuthor: boolean;
  isGuest: boolean;
  email: string;
  phone: string;
  identificationDocument: string;
  qrCodeLink: string;
  id: string;
  registrationStatus: RegistrationStatus;
  isTransferPayment: boolean;
  isCardPayment: boolean;
  cardPaymentProofLink: null;
  transferPaymentProofLink: null;
  createdAt: string;
}

export interface RegistrationStatus {
  isApproved: boolean;
  id: string;
  isCashPayment: boolean;
  voucherNumber: string;
}

export interface InscriptionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  identificationDocument: string;
  isAuthor: boolean;
  isGuest?: boolean;
  voucherNumber?: string;
}
export async function createInscriptionByAdmin(data: InscriptionData) {
  const response = await $api("/participants/byAdmin", {
    method: "POST",
    body: data,
  });
  return response;
}

export async function updateInscriptionByAdmin(
  id: string,
  data: Omit<InscriptionData, "voucherNumber">,
) {
  const response = await $api(`/participants/${id}`, {
    method: "PATCH",
    body: data,
  });
  return response;
}

export async function deleteInscriptionByAdmin(id: string) {
  const response = await $api(`/participants/${id}`, {
    method: "DELETE",
  });
  return response;
}

export async function getInscriptionByAdmin(id: string): Promise<Inscription> {
  const response = await $api<Inscription>(`/participants/${id}`, {
    method: "GET",
  });
  return response;
}

export async function approveInscriptionByAdmin(id: string) {
  const response = await $api(`/registration-status/approve/${id}`, {
    method: "PATCH",
  });
  return response;
}
