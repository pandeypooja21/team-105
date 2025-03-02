import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore, useRoomStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import CodeEditor from '@/components/CodeEditor';
import ChatBox from '@/components/ChatBox';
import LivePreview from '@/components/LivePreview';
import SubscriptionDialog from '@/components/SubscriptionDialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { User, Users, Github, AlertTriangle, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { currentRoom, joinRoom, isLoading, error, upgradeSubscription } = useRoomStore();
  const [githubRepo, setGithubRepo] = useState('');
  const [publishLoading, setPublishLoading] = useState(false);
  const [joinAttempted, setJoinAttempted] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'code' | 'preview'>('code');
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && roomId && !joinAttempted) {
      setJoinAttempted(true);
      
      console.log('Attempting to join room:', roomId);
      
      joinRoom(roomId)
        .then(room => {
          if (room) {
            console.log('Successfully joined room:', room);
            setJoinError(null);
          } else {
            console.error('Failed to join room - room is null');
            setJoinError('Room not found or could not be joined');
            toast({
              title: "Error joining room",
              description: "The room you're trying to join couldn't be found",
              variant: "destructive",
            });
          }
        })
        .catch(err => {
          console.error('Error joining room:', err);
          setJoinError(err.message || 'Failed to join room');
          toast({
            title: "Error joining room",
            description: err.message || "The room you're trying to join doesn't exist or has been deleted",
            variant: "destructive",
          });
        });
    }
  }, [isAuthenticated, roomId, joinRoom, joinAttempted]);

  const copyRoomId = () => {
    if (!currentRoom) return;
    
    navigator.clipboard.writeText(currentRoom.id);
    
    toast({
      title: "Room ID copied",
      description: "Share this with friends to invite them. Make sure they enter the exact ID.",
    });
  };

  const handlePublishToGithub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubRepo || !currentRoom) return;
    
    setPublishLoading(true);
    
    setTimeout(() => {
      setPublishLoading(false);
      toast({
        title: "Published to GitHub",
        description: `Code successfully published to ${githubRepo}`,
      });
      setGithubRepo('');
    }, 2000);
  };

  const handleUpgradeSuccess = () => {
    if (roomId) {
      upgradeSubscription(roomId);
      setSubscriptionDialogOpen(false);
    }
  };

  const isOwner = currentRoom && user && currentRoom.ownerId === user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error || joinError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || joinError}</p>
          
          {joinError && joinError.includes("not found") && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-left">
              <h3 className="font-medium mb-2">Possible reasons:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>The room ID might be incorrect</li>
                <li>The room might have been deleted</li>
                <li>You might have extra spaces in the room ID</li>
                <li>The room might be stored in a different browser or device</li>
              </ul>
            </div>
          )}
          
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The room you're trying to join doesn't exist or has been deleted.
          </p>
          <div className="mb-6 p-4 bg-muted rounded-lg text-left">
            <h3 className="font-medium mb-2">Troubleshooting tips:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Make sure the room ID is correct (no extra spaces)</li>
              <li>The room might have been created in a different browser</li>
              <li>Try creating a new room instead</li>
            </ul>
          </div>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{currentRoom.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users size={14} />
                <span>{currentRoom.participants.length}</span>
              </div>
              
              {currentRoom.hasSubscription && (
                <div className="flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full">
                  <Crown size={12} />
                  <span>Premium</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {isOwner && !currentRoom.hasSubscription && currentRoom.participants.length >= 12 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-yellow-500 border-yellow-500"
                onClick={() => setSubscriptionDialogOpen(true)}
              >
                <AlertTriangle size={14} />
                <span className="hidden sm:inline">Approaching Limit</span>
                <span className="sm:hidden">Upgrade</span>
              </Button>
            )}
          
            <div className="text-sm flex items-center px-3 py-1 bg-muted rounded-full">
              <span className="text-xs mr-2">ID:</span>
              <code className="font-mono">{currentRoom.id}</code>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 px-2"
                onClick={copyRoomId}
              >
                Copy
              </Button>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Github size={14} />
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Publish to GitHub</DialogTitle>
                  <DialogDescription>
                    Enter the repository name where you want to publish your code.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePublishToGithub}>
                  <div className="py-4">
                    <Label htmlFor="repo-name">Repository Name</Label>
                    <Input 
                      id="repo-name" 
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      placeholder="username/repository" 
                      className="mt-2"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={publishLoading}>
                      {publishLoading ? 'Publishing...' : 'Publish Code'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {isOwner && !currentRoom.hasSubscription && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setSubscriptionDialogOpen(true)}
              >
                <Crown size={14} />
                Upgrade
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-card rounded-lg overflow-hidden border h-[calc(100vh-220px)]">
            <Tabs 
              defaultValue="code" 
              value={previewTab} 
              onValueChange={(value) => setPreviewTab(value as 'code' | 'preview')}
              className="h-full flex flex-col"
            >
              <div className="border-b px-2">
                <TabsList className="h-9">
                  <TabsTrigger value="code" className="text-xs">Code Editor</TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className="text-xs"
                    disabled={!currentRoom.hasSubscription}
                  >
                    {!currentRoom.hasSubscription && <Crown size={12} className="mr-1" />}
                    Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="code" className="flex-1 m-0 p-0">
                <CodeEditor />
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 m-0 p-0">
                <LivePreview />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1 h-[calc(100vh-220px)]">
            <ChatBox />
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Users size={14} />
            Participants {!currentRoom.hasSubscription && `(${currentRoom.participants.length}/${currentRoom.maxParticipants})`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentRoom.participants.map((participant) => (
              <div 
                key={participant.id}
                className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"
              >
                <User size={12} />
                <span>{participant.name}</span>
                {participant.id === currentRoom.ownerId && (
                  <span className="text-primary ml-1">(Owner)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <SubscriptionDialog 
        open={subscriptionDialogOpen} 
        onOpenChange={setSubscriptionDialogOpen}
        onSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

export default Room;
