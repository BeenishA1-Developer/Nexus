import React, { useState } from 'react';
import { Calendar as CalendarIcon, Inbox, CheckCircle2 } from 'lucide-react';
import { MeetingCalendar } from '../../components/MeetingCalendar';
import { MeetingRequests } from '../../components/MeetingRequests';
import { Card, CardBody } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export const MeetingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'requests'>('calendar');

  const handleScheduleMeeting = (date: Date, time: string) => {
    // In a real app, this would be an API call
    toast.success(`Meeting requested for ${date.toLocaleDateString()} at ${time}`);
    console.log('Schedule meeting on', date, 'at', time);
  };

  const handleAcceptRequest = (requestId: string) => {
    toast.success('Meeting request accepted and added to your calendar');
    console.log('Accepted request', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    toast.error('Meeting request declined');
    console.log('Declined request', requestId);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings & Availability</h1>
          <p className="text-gray-600 mt-1">Manage your calendar, set availability, and respond to meeting invites.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'calendar' 
                ? 'bg-white text-primary-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarIcon size={16} className="mr-2" />
            Calendar & Slots
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'requests' 
                ? 'bg-white text-primary-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Inbox size={16} className="mr-2" />
            Incoming Requests
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'calendar' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="bg-primary-50 border-none shadow-sm">
              <CardBody className="py-4">
                <div className="flex items-start">
                  <CheckCircle2 className="text-primary-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-semibold text-primary-900">Pro Tip</h4>
                    <p className="text-xs text-primary-700 mt-0.5">
                      Keep your availability slots updated to make it easier for partners to book time with you. 
                      Dates with dots indicate existing meetings or slots.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <MeetingCalendar onScheduleMeeting={handleScheduleMeeting} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <MeetingRequests
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
            />
          </div>
        )}
      </div>
    </div>
  );
};