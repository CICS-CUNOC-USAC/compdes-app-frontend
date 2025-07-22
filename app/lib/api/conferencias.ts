import type { Participant } from "./participants";

export interface Activity {
  id: string;
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

export interface IsAssignedResponse {
  assistanceFound: boolean
}

export interface CountParticipantsResponse {
  total: number
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

export async function assignToWorkShop(activityId: string) {
  const response = await $api(`/reservations/register`, {
    method: 'POST',
    body: {'activityId': activityId},
  });
  return response;
}

export async function getUserWorkshops(): Promise<Activity[]> {
  const response = await $api(`/reservations/all`, {
    method: 'GET',
  });
  return response as Activity[];
}

export async function asigneesWorkshop(workshopId: string): Promise<Participant[]> {
  const response = await $api(`/reservations/allParticipants/${workshopId}`, {
    method: 'GET',
  });
  return response as Participant[];
}

export async function isAssigned(participantId: string, workshopId: string): Promise<IsAssignedResponse> {
  const response = await $api(`/reservations/isAssigned/${participantId}/${workshopId}`, {
    method: 'GET',
  });
  return response as IsAssignedResponse;
}

export async function countParticipants(workshopId: string): Promise<CountParticipantsResponse> {
  const response = await $api(`/reservations/countParticipants/${workshopId}`, {
    method: 'GET',
  });
  return response as CountParticipantsResponse;
}
