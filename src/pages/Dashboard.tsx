
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useRoomStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import RoomForm from '@/components/RoomForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { rooms, joinRoom } = useRoomStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  const handleJoinRoom = async (roomId: string) => {
    const room = await joinRoom(roomId);
    if (room) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-slide-down">
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">
              Your personal coding workspace
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Create/Join Room */}
            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <RoomForm />
            </div>
            
            {/* Right Column - Recent Rooms */}
            <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle>Recent Rooms</CardTitle>
                  <CardDescription>
                    Quickly access your recent coding sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {rooms.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You haven't created or joined any rooms yet
                      </p>
                      <p className="text-sm">
                        Create your first room to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rooms.map((room) => (
                        <Card key={room.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{room.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(room.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleJoinRoom(room.id)}
                              >
                                Join
                              </Button>
                            </div>
                            <div className="mt-3">
                              <p className="text-xs bg-muted p-2 rounded font-mono truncate">
                                ID: {room.id}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
