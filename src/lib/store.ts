import { create } from 'zustand';
import { AuthState, RoomState, User, Room, Message } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { persist } from 'zustand/middleware';

// Helper function to save rooms to localStorage
const saveRoomsToLocalStorage = (rooms: Room[]) => {
  try {
    localStorage.setItem('codeHuddleRooms', JSON.stringify(rooms));
    return true;
  } catch (error) {
    console.error('Error saving rooms to localStorage:', error);
    return false;
  }
};

// Helper function to get rooms from localStorage
const getLocalRooms = (): Room[] => {
  try {
    const storedRooms = localStorage.getItem('codeHuddleRooms');
    if (storedRooms) {
      return JSON.parse(storedRooms);
    }
  } catch (error) {
    console.error('Error getting rooms from localStorage:', error);
  }
  
  // Default room if none found
  return [
    {
      id: 'demo-room-123',
      name: 'JavaScript Workshop',
      ownerId: '1',
      code: '// Welcome to JavaScript Workshop\nconsole.log("Hello world!");\n\n// Start coding here',
      language: 'javascript',
      participants: [],
      messages: [],
      createdAt: Date.now(),
      hasSubscription: false,
      maxParticipants: 5
    },
  ];
};

// Get initial rooms from localStorage
const initialRooms = getLocalRooms();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Get profile information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        const user: User = {
          id: data.user.id,
          name: profileData?.username || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          avatar: profileData?.avatar_url,
        };
        
        set({ user, isAuthenticated: true, isLoading: false });
        return user;
      }
      
      return null;
    } catch (error: any) {
      set({ error: error.message || 'Failed to login', isLoading: false });
      return null;
    }
  },
  
  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          name: name,
          email: data.user.email || '',
        };
        
        set({ user, isAuthenticated: true, isLoading: false });
        return user;
      }
      
      return null;
    } catch (error: any) {
      set({ error: error.message || 'Failed to sign up', isLoading: false });
      return null;
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  // Initialize auth state from session
  initAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get profile information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        const user: User = {
          id: session.user.id,
          name: profileData?.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: profileData?.avatar_url,
        };
        
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }

    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get profile information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        const user: User = {
          id: session.user.id,
          name: profileData?.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: profileData?.avatar_url,
        };
        
        set({ user, isAuthenticated: true });
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false });
      }
    });
  }
}));

export const useRoomStore = create<RoomState & {
  rooms: Room[];
  createRoom: (name: string, language: string) => Promise<Room | null>;
  joinRoom: (roomId: string) => Promise<Room | null>;
  sendMessage: (content: string) => void;
  updateCode: (code: string) => void;
  upgradeSubscription: (roomId: string) => void;
}>(
  // Using persist middleware to keep rooms data in localStorage automatically
  persist(
    (set, get) => ({
      currentRoom: null,
      rooms: initialRooms,
      isLoading: false,
      error: null,
      
      createRoom: async (name: string, language: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API request
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Generate a simpler, more easily shareable room ID
          const randomId = Math.random().toString(36).substring(2, 8);
          const roomId = `r-${randomId}`;
          
          const newRoom: Room = {
            id: roomId,
            name,
            ownerId: user.id,
            code: `// Welcome to ${name}\n\n// Start coding here`,
            language: language as any,
            participants: [user],
            messages: [],
            createdAt: Date.now(),
            hasSubscription: false,
            maxParticipants: 5
          };
          
          // Get the latest rooms
          const existingRooms = get().rooms;
          const updatedRooms = [...existingRooms, newRoom];
          
          set({ 
            rooms: updatedRooms,
            currentRoom: newRoom,
            isLoading: false 
          });
          
          console.log('Created room:', newRoom);
          
          // Also manually save to localStorage as a backup
          saveRoomsToLocalStorage(updatedRooms);
          
          return newRoom;
        } catch (error: any) {
          set({ error: error.message || 'Failed to create room', isLoading: false });
          return null;
        }
      },
      
      joinRoom: async (roomId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Clean the room ID
          const cleanedRoomId = roomId.trim();
          console.log('Attempting to join room with ID:', cleanedRoomId);
          
          // Simulate API request
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Get the latest rooms
          const currentRooms = get().rooms;
          
          // Also check localStorage as a backup
          const storedRooms = getLocalRooms();
          
          // Combine rooms from state and localStorage (preferring state)
          const combinedRooms = [...currentRooms];
          
          // Add any rooms from localStorage that aren't in state
          storedRooms.forEach(storedRoom => {
            if (!combinedRooms.some(r => r.id === storedRoom.id)) {
              combinedRooms.push(storedRoom);
            }
          });
          
          // Update state with combined rooms
          set({ rooms: combinedRooms });
          
          // Find the room by ID
          let room = combinedRooms.find(r => r.id === cleanedRoomId);
          
          if (!room) {
            console.error(`Room not found with ID: ${cleanedRoomId}`);
            throw new Error(`Room not found with ID: ${cleanedRoomId}`);
          }
          
          // Check if user is already in the room
          const isParticipant = room.participants.some(p => p.id === user.id);
          
          // Check participant limit if not already a participant
          if (!isParticipant && !room.hasSubscription && room.participants.length >= room.maxParticipants) {
            throw new Error(`This room has reached the maximum of ${room.maxParticipants} participants. The room owner needs to upgrade to allow more participants.`);
          }
          
          // Add user to participants if not already present
          if (!isParticipant) {
            // Create a new room object with the updated participants
            room = {
              ...room,
              participants: [...room.participants, user]
            };
            
            // Update the rooms array with the updated room
            const updatedRooms = combinedRooms.map(r => (r.id === room!.id ? room! : r));
            
            // Save to localStorage and update state
            saveRoomsToLocalStorage(updatedRooms);
            set({ rooms: updatedRooms });
          }
          
          set({ currentRoom: room, isLoading: false });
          return room;
        } catch (error: any) {
          console.error('Error joining room:', error);
          set({ 
            error: error.message || 'Failed to join room', 
            isLoading: false 
          });
          return null;
        }
      },
      
      sendMessage: (content: string) => {
        const currentRoom = get().currentRoom;
        const user = useAuthStore.getState().user;
        
        if (!currentRoom || !user) return;
        
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          content,
          timestamp: Date.now(),
        };
        
        const updatedRoom = {
          ...currentRoom,
          messages: [...currentRoom.messages, newMessage]
        };
        
        // Update the rooms array with the updated room
        const updatedRooms = get().rooms.map(r => 
          r.id === updatedRoom.id ? updatedRoom : r
        );
        
        // Save to localStorage
        saveRoomsToLocalStorage(updatedRooms);
        
        set({ 
          currentRoom: updatedRoom,
          rooms: updatedRooms
        });
      },
      
      updateCode: (code: string) => {
        const currentRoom = get().currentRoom;
        if (!currentRoom) return;
        
        const updatedRoom = {
          ...currentRoom,
          code
        };
        
        // Update the rooms array with the updated room
        const updatedRooms = get().rooms.map(r => 
          r.id === updatedRoom.id ? updatedRoom : r
        );
        
        // Save to localStorage
        saveRoomsToLocalStorage(updatedRooms);
        
        set({ 
          currentRoom: updatedRoom,
          rooms: updatedRooms
        });
      },
      
      upgradeSubscription: (roomId: string) => {
        const rooms = get().rooms;
        const room = rooms.find(r => r.id === roomId);
        
        if (!room) return;
        
        const updatedRoom = {
          ...room,
          hasSubscription: true,
          maxParticipants: Infinity
        };
        
        // Update the rooms array with the updated room
        const updatedRooms = rooms.map(r => 
          r.id === updatedRoom.id ? updatedRoom : r
        );
        
        // Save to localStorage
        saveRoomsToLocalStorage(updatedRooms);
        
        set({ 
          rooms: updatedRooms,
          currentRoom: get().currentRoom?.id === roomId ? updatedRoom : get().currentRoom
        });
      }
    }),
    {
      name: 'code-huddle-rooms', // localStorage key
      partialize: (state) => ({ 
        rooms: state.rooms,
        // Don't persist these ephemeral states
        currentRoom: null,
        isLoading: false,
        error: null
      }),
    }
  )
);
