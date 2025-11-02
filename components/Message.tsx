
import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon, BotIcon } from './icons';

const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderLine = (line: string) => {
        return line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={index}>{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };

    return (
        <div className="space-y-2">
            {content.split('\n').map((line, index) => {
                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    return (
                        <div key={index} className="flex items-start">
                            <span className="mr-2 mt-1">∙</span>
                            <span>{renderLine(line.substring(line.indexOf(' ') + 1))}</span>
                        </div>
                    );
                }
                const numberedListMatch = line.trim().match(/^(\d+)\.\s(.*)/);
                if (numberedListMatch) {
                    return (
                        <div key={index} className="flex items-start">
                            <span className="mr-2 mt-1 w-5 flex-shrink-0">{numberedListMatch[1]}.</span>
                            <span>{renderLine(numberedListMatch[2])}</span>
                        </div>
                    )
                }
                if (line.trim() === '') return <div key={index} className="h-2" />;
                return <p key={index}>{renderLine(line)}</p>;
            })}
        </div>
    );
};

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const bubbleClasses = isUser
    ? 'bg-cyan-600 text-white rounded-l-xl rounded-t-xl'
    : 'bg-gray-700 text-gray-200 rounded-r-xl rounded-t-xl';
  
  const containerClasses = isUser
    ? 'flex items-start justify-end'
    : 'flex items-start justify-start';

  const Avatar = isUser ? 
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center ml-3 order-2 flex-shrink-0">
        <UserIcon className="w-5 h-5 text-gray-300"/>
    </div>
    : 
    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center mr-3 order-1 flex-shrink-0">
        <BotIcon className="w-5 h-5 text-white"/>
    </div>;

  return (
    <div className={`${containerClasses} max-w-3xl`}>
      {!isUser && Avatar}
      <div className={`px-4 py-3 ${bubbleClasses} max-w-xl lg:max-w-2xl shadow-md text-sm sm:text-base leading-relaxed`}>
         <ContentRenderer content={message.content} />
      </div>
      {isUser && Avatar}
    </div>
  );
};

export default Message;
