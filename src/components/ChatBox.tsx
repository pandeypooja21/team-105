
import { useState, useRef, useEffect } from 'react';
import { useAuthStore, useRoomStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ChatMessage = ({ message, isCurrentUser }: any) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
        <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
          {!isCurrentUser && <User size={12} />}
          <span>{message.senderName}</span>
        </div>
        <p className="text-sm">{message.content}</p>
        <span className="text-[10px] opacity-50 block text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

const ChatBox = () => {
  const { user } = useAuthStore();
  const { currentRoom, sendMessage } = useRoomStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    sendMessage(message);
    setMessage('');
  };

  // Simulate typing indicator
  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      // In a real app, you would emit a "typing" event to the server here
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = window.setTimeout(() => {
      setTyping(false);
      // In a real app, you would emit a "stop typing" event to the server here
    }, 2000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoom?.messages]);

  if (!currentRoom) {
    return (
      <Card className="h-full flex flex-col glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare size={18} />
            Chat
          </CardTitle>
          <CardDescription>
            Join a room to start chatting
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare size={18} />
          Chat
        </CardTitle>
        <CardDescription>
          {currentRoom.participants.length} {currentRoom.participants.length === 1 ? 'person' : 'people'} in the room
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-3 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {currentRoom.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <>
              {currentRoom.messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  isCurrentUser={user?.id === msg.senderId} 
                />
              ))}
              {typing && (
                <div className="flex justify-start mb-3">
                  <div className="bg-muted p-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-2">
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={() => handleTyping()}
            placeholder="Type a message..."
            className="flex-1 glass-input"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
