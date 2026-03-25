import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { isSameDay } from 'date-fns/isSameDay';
import { Calendar as CalendarIcon, Clock, Plus, Edit } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { useAuth } from '../context/AuthContext';
import { Meeting, AvailabilitySlot } from '../types';
import { meetings, availabilitySlots } from '../data/meetings';

interface MeetingCalendarProps {
  onScheduleMeeting?: (date: Date, time: string) => void;
  meetings?: Meeting[];
}

export const MeetingCalendar: React.FC<MeetingCalendarProps> = ({ onScheduleMeeting, meetings: externalMeetings }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userMeetings, setUserMeetings] = useState<Meeting[]>([]);
  const [userAvailability, setUserAvailability] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    if (user) {
      // Filter meetings where user is participant
      const allMeetings = externalMeetings || meetings;
      const myMeetings = allMeetings.filter((m: Meeting) => m.participants.includes(user.id));
      setUserMeetings(myMeetings);

      // Filter availability for user
      const myAvailability = availabilitySlots.filter((slot: AvailabilitySlot) => slot.userId === user.id);
      setUserAvailability(myAvailability);
    }
  }, [user, externalMeetings]);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const getMeetingsForDate = (date: Date) => {
    return userMeetings.filter(m => isSameDay(new Date(m.date), date));
  };

  const getAvailabilityForDate = (date: Date) => {
    return userAvailability.filter(slot =>
      isSameDay(new Date(slot.date), date) && slot.isAvailable
    );
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayMeetings = getMeetingsForDate(date);
      const dayAvailability = getAvailabilityForDate(date);

      return (
        <div className="text-xs">
          {dayMeetings.length > 0 && (
            <div className="w-2 h-2 bg-primary-500 rounded-full mx-auto mb-1"></div>
          )}
          {dayAvailability.length > 0 && (
            <div className="w-2 h-2 bg-secondary-500 rounded-full mx-auto"></div>
          )}
        </div>
      );
    }
    return null;
  };

  const selectedDateMeetings = getMeetingsForDate(selectedDate);
  const selectedDateAvailability = getAvailabilityForDate(selectedDate);

  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('09:00');

  const handleAddSlot = () => {
    if (!user) return;
    
    const newSlot: AvailabilitySlot = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: newSlotTime,
      endTime: format(new Date(`2000-01-01T${newSlotTime}:00`).getTime() + 3600000, 'HH:mm'),
      isAvailable: true
    };

    setUserAvailability(prev => [...prev, newSlot]);
    setIsAddingSlot(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CalendarIcon className="mr-2" size={20} />
                Meeting Calendar
              </h3>
            </CardHeader>
            <CardBody>
              <div className="calendar-container">
                <style>{`
                  .react-calendar {
                    width: 100%;
                    border: none;
                    font-family: inherit;
                  }
                  .react-calendar__tile--active {
                    background: #3B82F6 !important;
                    border-radius: 0.5rem;
                  }
                  .react-calendar__tile--now {
                    background: #EFF6FF;
                    border-radius: 0.5rem;
                  }
                `}</style>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full border-none"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                  Meetings
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                  Available Slots
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="lg:w-80">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Meetings */}
              {selectedDateMeetings.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Meetings</h4>
                  <div className="space-y-2">
                    {selectedDateMeetings.map(meeting => (
                      <div key={meeting.id} className="p-3 bg-primary-50 rounded-md">
                        <div className="font-medium text-primary-900">{meeting.title}</div>
                        <div className="text-sm text-primary-700 flex items-center mt-1">
                          <Clock size={14} className="mr-1" />
                          {meeting.startTime} - {meeting.endTime}
                        </div>
                        <Badge variant="primary" className="mt-2 text-xs">
                          {meeting.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {selectedDateAvailability.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Available Slots</h4>
                  <div className="space-y-2">
                    {selectedDateAvailability.map(slot => (
                      <div key={slot.id} className="p-3 bg-secondary-50 rounded-md">
                        <div className="text-sm text-secondary-700 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => onScheduleMeeting?.(selectedDate, slot.startTime)}
                        >
                          <Plus size={14} className="mr-1" />
                          Schedule
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Availability */}
              <div className="pt-2">
                {isAddingSlot ? (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md border border-gray-200 animate-slide-in">
                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsAddingSlot(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1" onClick={handleAddSlot}>
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    leftIcon={<Edit size={16} />}
                    onClick={() => setIsAddingSlot(true)}
                  >
                    Manage Availability
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};