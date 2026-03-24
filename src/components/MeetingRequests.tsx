import React, { useState, useEffect } from 'react';
import { Check, X, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { useAuth } from '../context/AuthContext';
import { MeetingRequest } from '../types';
import { meetingRequests } from '../data/meetings';
import { users } from '../data/users';

interface MeetingRequestsProps {
  onAcceptRequest?: (requestId: string) => void;
  onDeclineRequest?: (requestId: string) => void;
}

export const MeetingRequests: React.FC<MeetingRequestsProps> = ({
  onAcceptRequest,
  onDeclineRequest
}) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MeetingRequest[]>([]);

  useEffect(() => {
    if (user) {
      // Filter requests where user is recipient
      const myRequests = meetingRequests.filter((req: MeetingRequest) => req.recipientId === user.id);
      setRequests(myRequests);
    }
  }, [user]);

  const handleAccept = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
    onAcceptRequest?.(requestId);
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'declined' } : req
      )
    );
    onDeclineRequest?.(requestId);
  };

  const getRequesterName = (requesterId: string) => {
    const user = users.find((u: any) => u.id === requesterId);
    return user?.name || 'Unknown User';
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const respondedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="mr-2" size={20} />
              Pending Meeting Requests ({pendingRequests.length})
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <User size={16} className="text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">
                          {getRequesterName(request.requesterId)}
                        </span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Meeting Request
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{request.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{request.message}</p>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          <span>Proposed: {request.proposedDate}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={14} />
                          <span>Time: {request.proposedStartTime} - {request.proposedEndTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(request.id)}
                        className="flex-1 sm:w-28 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X size={14} className="mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                        className="flex-1 sm:w-28 bg-green-600 hover:bg-green-700 hover:text-white"
                      >
                        <Check size={14} className="mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Responded Requests */}
      {respondedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Responses</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {respondedRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium text-gray-900">{request.title}</div>
                    <div className="text-sm text-gray-600">
                      From {getRequesterName(request.requesterId)} • {request.proposedDate}
                    </div>
                  </div>
                  <Badge
                    variant={request.status === 'accepted' ? 'success' : 'secondary'}
                  >
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {requests.length === 0 && (
        <Card>
          <CardBody className="text-center py-8">
            <Clock size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Meeting Requests</h3>
            <p className="text-gray-600">You don't have any meeting requests at the moment.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};