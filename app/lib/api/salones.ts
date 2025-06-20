export interface Salon {
    id: number,
    name: string,
    module: string
}
export async function postSalones(values: any){
  const response = await $api(`/endpoint`, {
    method: 'POST',
    body: values,
  });
  return response;
}

export async function getSalones(): Promise<Salon[]> {
  const response = await $api(`/`, {
    method: 'GET',
  });
  return response as Salon[];
}