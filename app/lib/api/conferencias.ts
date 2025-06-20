export async function postConferencias(values: any){
  const response = await $api(`/endpoint`, {
    method: 'POST',
    body: values,
  });
  return response;
}