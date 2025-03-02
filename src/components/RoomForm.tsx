
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Copy } from 'lucide-react';

const RoomForm = () => {
  const { createRoom, joinRoom, isLoading } = useRoomStore();
  const navigate = useNavigate();
  
  const [createRoomData, setCreateRoomData] = useState({
    name: '',
    language: 'javascript',
  });
  
  const [joinRoomId, setJoinRoomId] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [joiningError, setJoiningError] = useState<string | null>(null);

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setCreateRoomData((prev) => ({ ...prev, language: value }));
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const room = await createRoom(createRoomData.name, createRoomData.language);
      if (room) {
        setCreatedRoomId(room.id);
        toast({
          title: "Room created",
          description: `Room "${room.name}" has been created with ID: ${room.id}`,
        });
        // Intentionally not navigating right away to allow copying the room ID
      } else {
        toast({
          title: "Error",
          description: "Failed to create room",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
      });
    }
  };

  const copyRoomId = () => {
    if (!createdRoomId) return;
    
    navigator.clipboard.writeText(createdRoomId);
    toast({
      title: "Room ID copied",
      description: "Share this ID with your friends so they can join your room",
    });
  };

  const handleEnterRoom = () => {
    if (createdRoomId) {
      navigate(`/room/${createdRoomId}`);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoiningError(null);
    
    if (!joinRoomId.trim()) {
      setJoiningError("Room ID is required");
      toast({
        title: "Error",
        description: "Room ID is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Clean the room ID (remove spaces, etc.)
      const cleanedRoomId = joinRoomId.trim();
      console.log('Attempting to join room with ID:', cleanedRoomId);
      
      const room = await joinRoom(cleanedRoomId);
      
      if (room) {
        toast({
          title: "Room joined",
          description: `You've joined "${room.name}"`,
        });
        navigate(`/room/${room.id}`);
      } else {
        setJoiningError("Room not found");
        toast({
          title: "Error",
          description: "Room not found with the provided ID",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error joining room:', error);
      setJoiningError(error.message || "Failed to join room");
      toast({
        title: "Error",
        description: error.message || "Failed to join room",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Collaborate in Real-time
        </CardTitle>
        <CardDescription className="text-center">
          Create a new room or join an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create">Create Room</TabsTrigger>
            <TabsTrigger value="join">Join Room</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            {!createdRoomId ? (
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="My Coding Session"
                    value={createRoomData.name}
                    onChange={handleCreateChange}
                    required
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select 
                    value={createRoomData.language} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger id="language" className="glass-input">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Room'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Room Created Successfully!</h3>
                  <p className="text-sm mb-3">Share this Room ID with your friends:</p>
                  
                  <div className="flex gap-2 items-center">
                    <Input 
                      value={createdRoomId} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={copyRoomId}
                      title="Copy Room ID"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    Make sure to save this ID. You'll need it to rejoin the room later.
                  </p>
                </div>
                
                <Button onClick={handleEnterRoom} className="w-full">
                  Enter Room
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="join">
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Room ID</Label>
                <Input
                  id="roomId"
                  placeholder="Enter room ID"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  required
                  className="glass-input font-mono"
                />
                {joiningError && (
                  <div className="flex items-center gap-2 text-destructive text-sm mt-1">
                    <AlertCircle size={14} />
                    <p>{joiningError}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Make sure to enter the exact room ID without any extra spaces
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Joining...' : 'Join Room'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        Free tier supports up to 5 participants per room
      </CardFooter>
    </Card>
  );
};

export default RoomForm;
