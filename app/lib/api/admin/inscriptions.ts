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
