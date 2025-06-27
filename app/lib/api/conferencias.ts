export async function postConferencias(values: any){
  const response = await $api(`/activities`, {
    method: 'POST',
    body: values,
  });
  return response;
}