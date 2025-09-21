
import React from 'react';
import { Message, MessageSender } from '../types';

interface MessageBoxProps {
  message: Message;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AIIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);


const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.User;

  const containerClasses = `flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-xl p-4 rounded-xl shadow-md prose prose-invert prose-p:my-0 prose-headings:my-0 ${
    isUser
      ? 'bg-blue-600 text-white rounded-br-none'
      : 'bg-gray-700 text-gray-200 rounded-bl-none'
  }`;

  const iconClasses = `flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
    isUser ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
  }`;
  
  const formattedText = message.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className={iconClasses}>
          <AIIcon />
        </div>
      )}
      <div className={bubbleClasses}>
        <p>{formattedText}</p>
      </div>
      {isUser && (
        <div className={iconClasses}>
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default MessageBox;
