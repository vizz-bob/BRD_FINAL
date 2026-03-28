import { Phone, Mail, MessageSquare, Video } from 'lucide-react';

const QuickActionButtons = ({ contact }) => {
  const handleCall = () => {
    console.log('Calling:', contact.mobile);
    // Integration with dialer
  };

  const handleEmail = () => {
    console.log('Emailing:', contact.email);
    // Open email composer
  };

  const handleWhatsApp = () => {
    console.log('WhatsApp:', contact.mobile);
    // Open WhatsApp
  };

  const handleVideoCall = () => {
    console.log('Video call:', contact.email);
    // Schedule video meeting
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCall();
        }}
        className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition text-sm"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Call</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEmail();
        }}
        className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition text-sm"
      >
        <Mail className="w-4 h-4" />
        <span className="hidden sm:inline">Email</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleWhatsApp();
        }}
        className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition text-sm"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Chat</span>
      </button>
    </div>
  );
};

export default QuickActionButtons;