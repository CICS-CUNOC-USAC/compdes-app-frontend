export interface Salon {
    id: number,
    name: string,
    module: string
}
export async function postSalones(values: any){
  const response = await $api(`/classrooms/create`, {
    method: 'POST',
    body: values,
  });
  return response;
}

export async function getSalones(): Promise<Salon[]> {
  const response = await $api(`/classrooms/all`, {
    method: 'GET',
  });
  return response as Salon[];
}