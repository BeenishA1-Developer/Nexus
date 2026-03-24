import { Meeting, MeetingRequest, AvailabilitySlot } from '../types';

export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: '1',
    userId: '1', // entrepreneur
    date: '2024-03-25',
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: true,
  },
  {
    id: '2',
    userId: '1',
    date: '2024-03-25',
    startTime: '14:00',
    endTime: '15:00',
    isAvailable: true,
  },
  {
    id: '3',
    userId: '2', // investor
    date: '2024-03-26',
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true,
  },
];

export const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Investment Discussion',
    date: '2024-03-25',
    startTime: '10:00',
    endTime: '11:00',
    participants: ['1', '2'],
    organizerId: '1',
    status: 'scheduled',
    description: 'Discuss potential investment in startup',
  },
];

export const meetingRequests: MeetingRequest[] = [
  {
    id: '1',
    requesterId: '2',
    recipientId: '1',
    proposedDate: '2024-03-26',
    proposedStartTime: '14:00',
    proposedEndTime: '15:00',
    title: 'Follow-up Meeting',
    message: 'Would like to schedule a follow-up discussion',
    status: 'pending',
    createdAt: '2024-03-24T10:00:00Z',
  },
];