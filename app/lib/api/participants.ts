import type { Entity } from "./shared";

export interface Participant extends Entity {
  firstName: string
  lastName: string
  email: string
  phone: string
  organisation: string
  isAuthor: boolean
  isGuest: boolean
  identificationDocument: string
  registrationStatus: RegistrationStatus
}

export interface RegistrationStatus extends Entity {
  isApproved: boolean
  isCashPayment: boolean
}
