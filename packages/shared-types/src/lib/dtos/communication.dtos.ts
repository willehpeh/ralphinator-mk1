import { CommunicationType } from '../types/communication-type.type';

/**
 * Read model interface for communication queries
 * Used by frontend to display communication data
 */
export interface CommunicationReadModel {
  id: string;
  type: CommunicationType;
  subject: string;
  communicationDate: string; // ISO string for API transport
  duration: number | null;
  notes: string;
  clientId: string;
  clientName: string;
  contactId: string | null;
  contactName: string | null;
  projectId: string | null;
  projectName: string | null;
  followUpRequired: boolean;
  followUpDate: string | null; // ISO string for API transport
  followUpCompleted: boolean;
  createdAt: string; // ISO string for API transport
  updatedAt: string; // ISO string for API transport
}
