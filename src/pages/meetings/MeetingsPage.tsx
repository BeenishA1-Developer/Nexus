import React from 'react';
import { MeetingCalendar } from '../../components/MeetingCalendar';
import { MeetingRequests } from '../../components/MeetingRequests';

export const MeetingsPage: React.FC = () => {
  const handleScheduleMeeting = (date: Date, time: string) => {
    // TODO: Implement scheduling logic
    console.log('Schedule meeting on', date, 'at', time);
  };

  const handleAcceptRequest = (requestId: string) => {
    // TODO: Implement accept logic
    console.log('Accepted request', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    // TODO: Implement decline logic
    console.log('Declined request', requestId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
        <p className="text-gray-600 mt-2">Schedule and manage your meetings</p>
      </div>

      <MeetingCalendar onScheduleMeeting={handleScheduleMeeting} />

      <MeetingRequests
        onAcceptRequest={handleAcceptRequest}
        onDeclineRequest={handleDeclineRequest}
      />
    </div>
  );
};