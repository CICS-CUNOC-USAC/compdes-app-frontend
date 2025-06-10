export async function createInscription(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  isAuthor: boolean;
  identificationDocument: string;
  paymentProof?: {
    link: string;
  };
  file?: File;
}) {
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("organisation", data.organisation);
  formData.append("identificationDocument", data.identificationDocument);
  formData.append("isAuthor", String(data.isAuthor));
  if (data.paymentProof) {
    formData.append("paymentProof", JSON.stringify(data.paymentProof));
  }
  if (data.file) {
    formData.append("file", data.file);
  }
  console.log("FormData:", formData);
  // const response = await $api("/participants", {
  //   method: "POST",
  //   body: formData,
  // });
}
