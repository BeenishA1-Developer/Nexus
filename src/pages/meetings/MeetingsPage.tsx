import React, { useState } from 'react';
import { Calendar as CalendarIcon, Inbox, CheckCircle2, Clock, User as UserIcon, MoreHorizontal } from 'lucide-react';
import { MeetingCalendar } from '../../components/MeetingCalendar';
import { MeetingRequests } from '../../components/MeetingRequests';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { meetings as initialMeetings } from '../../data/meetings';
import { Meeting } from '../../types';
import toast from 'react-hot-toast';

export const MeetingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calendar' | 'requests'>('calendar');
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

  const handleScheduleMeeting = (date: Date, time: string) => {
    if (!user) return;

    const dateStr = date.toISOString().split('T')[0];
    
    // Check if meeting already exists for this time
    if (meetings.find(m => m.date === dateStr && m.startTime === time)) {
      toast.error('You already have a meeting scheduled at this time');
      return;
    }

    const newMeeting: Meeting = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Discussion',
      date: dateStr,
      startTime: time,
      endTime: time.split(':')[0] + ':45', // Default 45 mins
      participants: [user.id, '2'], // Mocking a partner for demo
      organizerId: user.id,
      status: 'scheduled',
      description: 'Newly scheduled collaboration session to discuss project roadmap and milestones.'
    };

    setMeetings(prev => [...prev, newMeeting]);
    toast.success(`Meeting scheduled for ${date.toLocaleDateString()} at ${time}`);
  };

  const handleAcceptRequest = (requestId: string) => {
    toast.success('Meeting request accepted');
    // In real app, we would add the request to 'meetings' state here too
  };

  const handleDeclineRequest = (requestId: string) => {
    toast.error('Meeting request declined');
  };

  // Filter meetings for the current user
  const userMeetings = meetings.filter(m => user && m.participants.includes(user.id));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings & Sessions</h1>
          <p className="text-gray-600 mt-1">Manage your calendar, set availability, and track your confirmed meetings.</p>
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
            Agenda & Calendar
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
            Requests
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'calendar' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Top Stats/Pro-Tip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary-50 border-none">
                <CardBody className="py-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-primary-600 mr-3" size={24} />
                    <div>
                      <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Scheduled</p>
                      <h4 className="text-xl font-bold text-primary-900">{userMeetings.length} Meetings</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="md:col-span-2">
                <Card className="bg-amber-50 border-none h-full">
                  <CardBody className="py-4 flex items-center">
                    <p className="text-sm text-amber-800">
                      <strong>Tip:</strong> Click on available slots in the calendar to instantly schedule a new session. 
                      Your confirmed meetings will appear in the detailed list below.
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Main Calendar component with state sync */}
            <MeetingCalendar 
              onScheduleMeeting={handleScheduleMeeting} 
              meetings={meetings}
            />

            {/* Confirmed Meetings Description List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="mr-2 text-primary-600" size={22} />
                  Confirmed Schedule Details
                </h3>
              </div>

              {userMeetings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userMeetings.sort((a,b) => a.date.localeCompare(b.date)).map((meeting) => (
                    <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                      <CardBody className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-gray-50 p-4 md:w-48 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100">
                            <span className="text-sm font-bold text-primary-600 uppercase">
                              {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-3xl font-black text-gray-900 leading-none my-1">
                              {new Date(meeting.date).getDate()}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {meeting.startTime} - {meeting.endTime}
                            </span>
                          </div>
                          <div className="p-5 flex-1 relative">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="primary" className="mb-2">{meeting.status}</Badge>
                                <h4 className="text-lg font-bold text-gray-900">{meeting.title}</h4>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={20} />
                              </button>
                            </div>
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                              {meeting.description || 'No description provided for this session.'}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <UserIcon size={14} className="mr-1" />
                                2 Participants
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                45 Minutes
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
                  <CardBody className="py-12 text-center">
                    <CalendarIcon className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">No meetings scheduled yet. Use the calendar above to book slots.</p>
                  </CardBody>
                </Card>
              )}
            </div>
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