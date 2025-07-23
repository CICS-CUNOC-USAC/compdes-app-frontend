import type { NitroFetchOptions } from "nitropack";
import type { Participant } from "./participants";

export interface InscriptionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  areaCode: string;
  organisation: string;
  isAuthor: boolean;
  identificationDocument: string;
  paymentProof?: {
    link: string;
  };
  file?: File;
}
export async function createInscription(data: InscriptionData) {
  console.log("Creating inscription with data:", data);
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("phone", `${data.areaCode}${data.phone}`);
  formData.append("organisation", data.organisation);
  formData.append("identificationDocument", data.identificationDocument);
  formData.append("isAuthor", String(data.isAuthor));
  // if (data.paymentProof) {
  //   formData.append("paymentProof", JSON.stringify(data.paymentProof));
  // }
  if (data.paymentProof) {
    formData.append("paymentProof.link", data.paymentProof.link);
  }
  if (data.file) {
    formData.append("file", data.file);
  }
  const response = await $api("/participants", {
    method: "POST",
    body: formData,
  });
  return response;
}

export async function verifyInscriptionById(
  id: string,
  opts: NitroFetchOptions<any>,
) {
  const response = await $api(
    `/participants/public-inscription/by-document/${id}`,
    opts,
  );
  return response;
}

export async function patchPassword(values: any, user_id: string) {
  const response = await $api(`/users/finalize/${user_id}`, {
    method: "PATCH",
    body: values,
  });
  return response;
}

export async function getParticipantInfoByQr(
  qrId: string,
): Promise<Participant> {
  const response = await $api<Participant>(`/participants/by-qr/${qrId}/admin`);
  return response;
}
