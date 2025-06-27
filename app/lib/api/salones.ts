export interface Salon {
  id: string;
  name: string;
  moduleUni: {
    id: string;
    name: string;
  };
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