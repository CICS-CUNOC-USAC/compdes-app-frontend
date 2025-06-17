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

export async function deleteInscriptionByAdmin(id: string) {
  const response = await $api(`/participants/${id}`, {
    method: "DELETE",
  });
  return response;
}

export async function getInscriptionByAdmin(id: string) {
  const response = await $api(`/participants/${id}`, {
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