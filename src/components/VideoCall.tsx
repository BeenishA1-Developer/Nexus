import React, { useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, MonitorUp, Users, MessageSquare } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';

export const VideoCall: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  if (!isCallActive) {
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardBody className="flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ready to join?</h2>
          <p className="text-gray-600 max-w-md">Start the video session to collaborate with your investor or entrepreneur counterpart.</p>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 py-3 text-lg"
            onClick={() => setIsCallActive(true)}
          >
            Start Video Call
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl animate-fade-in relative">
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="flex items-center gap-3">
          <Badge variant="success" className="animate-pulse">Live</Badge>
          <span className="text-white font-medium drop-shadow-md">Investment Pitch Meeting</span>
        </div>
        <div className="text-white font-mono drop-shadow-md bg-black/30 px-3 py-1 rounded-md">
          12:45
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col sm:flex-row relative">
        {/* Remote Participant */}
        <div className="flex-1 bg-gray-800 relative flex items-center justify-center border-r border-gray-700/50">
          <img 
            src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Remote Participant" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Avatar src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg" size="sm" alt="Jennifer" />
            <span className="text-white text-sm font-medium">Jennifer Lee (Investor)</span>
          </div>
        </div>

        {/* Local Participant */}
        <div className="sm:w-1/3 sm:min-w-[300px] h-1/3 sm:h-full bg-gray-950 relative flex items-center justify-center shrink-0 border-t sm:border-t-0 border-gray-700/50">
          {isVideoOn ? (
            <img 
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="You" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Avatar src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" size="lg" alt="You" />
              <span className="text-gray-400 mt-3 text-sm">Camera Off</span>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <span className="text-white text-sm font-medium">You</span>
          </div>
          {isMuted && (
            <div className="absolute top-4 right-4 bg-red-500/80 p-1.5 rounded-md">
              <MicOff size={16} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-900 p-4 sm:p-6 flex flex-wrap justify-center sm:justify-between items-center gap-4 border-t border-gray-800">
        <div className="hidden sm:flex items-center gap-2 text-gray-400">
          <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white" aria-label="Participants">
            <Users size={20} />
          </Button>
          <Button variant="ghost" className="text-gray-300 hover:bg-gray-800 hover:text-white" aria-label="Chat">
            <MessageSquare size={20} />
          </Button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Button 
            variant="outline" 
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center border-gray-700 ${isMuted ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20' : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          <Button 
            variant="outline" 
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center border-gray-700 ${!isVideoOn ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20' : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Camera size={20} /> : <CameraOff size={20} />}
          </Button>
          <Button 
            variant="outline" 
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center border-gray-700 ${isScreenSharing ? 'bg-primary-500/20 text-primary-400 border-primary-500/50 hover:bg-primary-500/30' : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
            <MonitorUp size={20} />
          </Button>
          <Button 
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-lg mx-2"
            onClick={() => {
              setIsCallActive(false);
              setIsVideoOn(true);
              setIsMuted(false);
              setIsScreenSharing(false);
            }}
          >
            <PhoneOff size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};
