export interface Modulo {
  id: number;
  name: string;
}

export async function postModules(values: any){
  const response = await $api(`/modules/create`, {
    method: 'POST',
    body: values,
  });
  return response;
}

export async function getModulos(): Promise<Modulo[]> {
  const response = await $api(`/modules/all`, {
    method: 'GET',
  });
  return response as Modulo[];
}
