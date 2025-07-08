export interface Activity {
  id: number;
  name: string;
  description: string;
  type: string;
  initScheduledDate: string;
  endScheduledDate: string;
  classroom: {
    id: string;
    name: string;
    moduleUni?: {           
      id: string;
      name: string;
    };
  };
}


export async function postConferencias(values: any){
  const response = await $api(`/activities`, {
    method: 'POST',
    body: values,
  });
  return response;
}

export async function getConferences(): Promise<Activity[]> {
  const response = await $api(`/activities/all`, {
    method: 'GET',
  });
  return response as Activity[];
}
