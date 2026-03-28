import React from 'react';
import { Plus } from 'lucide-react';
import ContactCard from './ContactCard';

const ContactsList = ({ 
  contacts, 
  viewMode, 
  selectedContact, 
  onSelectContact, 
  onEditContact, 
  onDeleteContact,
  onAddContact 
}) => {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
        <p className="text-gray-500 mb-4">Get started by adding your first contact</p>
        <button
          onClick={onAddContact}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Add Contact
        </button>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {contacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          isSelected={selectedContact?.id === contact.id}
          viewMode={viewMode}
          onSelect={() => onSelectContact(contact)}
          onEdit={() => onEditContact(contact)}
          onDelete={() => onDeleteContact(contact.id)}
        />
      ))}
    </div>
  );
};

export default ContactsList;