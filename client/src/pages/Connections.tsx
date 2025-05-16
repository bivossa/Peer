import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import ConnectionCard from "@/components/connections/ConnectionCard";
import MatchItem from "@/components/connections/MatchItem";
import { Sliders, MapPin } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/hooks/use-location";

// Default user ID (in a real app, this would come from auth)
const CURRENT_USER_ID = 1;

export default function Connections() {
  const { toast } = useToast();
  const { userLocation, locationError } = useLocation();
  const [distance, setDistance] = useState(10);
  
  // Get nearby users
  const { data: nearbyUsers, isLoading: loadingNearby } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'nearby', { distance }],
    enabled: !!userLocation,
  });
  
  // Get user matches
  const { data: matches, isLoading: loadingMatches } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'matches'],
  });
  
  // Current profile to display
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const currentProfile = nearbyUsers?.[currentProfileIndex];
  
  // Create connection mutation
  const createConnection = useMutation({
    mutationFn: async ({ targetUserId, status }: { targetUserId: number, status: "liked" | "rejected" }) => {
      return apiRequest('POST', '/api/connections', {
        userId: CURRENT_USER_ID,
        targetUserId,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'matches'] });
      // Move to next profile
      setCurrentProfileIndex(prev => 
        prev < (nearbyUsers?.length || 0) - 1 ? prev + 1 : prev
      );
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'operazione",
        variant: "destructive",
      });
    }
  });
  
  const handleLike = () => {
    if (!currentProfile) return;
    createConnection.mutate({ 
      targetUserId: currentProfile.id, 
      status: "liked" 
    });
  };
  
  const handleDislike = () => {
    if (!currentProfile) return;
    createConnection.mutate({ 
      targetUserId: currentProfile.id, 
      status: "rejected" 
    });
  };
  
  const handleSuper = () => {
    if (!currentProfile) return;
    toast({
      title: "Super Like",
      description: "Hai inviato un Super Like!",
    });
    createConnection.mutate({ 
      targetUserId: currentProfile.id, 
      status: "liked" 
    });
  };
  
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-semibold">Trova connessioni</h2>
        <div className="flex items-center space-x-3">
          <IconButton icon={<Sliders className="h-5 w-5 text-neutral-500" />} />
          <IconButton icon={<MapPin className="h-5 w-5 text-neutral-500" />} />
        </div>
      </div>

      {/* Location filter chip */}
      <div className="flex mb-6 items-center">
        <span className="text-sm text-neutral-500 mr-2">Vicino a te:</span>
        <Badge variant="secondary" className="text-secondary-700 flex items-center">
          {userLocation ? 'Posizione attuale' : 'Milano'}, {distance} km
          <button className="ml-2 text-secondary-400">
            <i className="fas fa-times-circle"></i>
          </button>
        </Badge>
      </div>

      {/* Connection Card */}
      <div className="relative h-[460px] max-w-md mx-auto">
        {loadingNearby ? (
          <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <Skeleton className="h-full w-full" />
          </div>
        ) : !nearbyUsers || nearbyUsers.length === 0 ? (
          <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center p-6">
              <i className="fas fa-search text-4xl text-neutral-400 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Nessuna connessione trovata</h3>
              <p className="text-neutral-500">
                {locationError ? 'Impossibile rilevare la tua posizione' : 'Prova ad ampliare il raggio di ricerca'}
              </p>
            </div>
          </div>
        ) : (
          <ConnectionCard profile={currentProfile} />
        )}
        
        {/* Action Buttons */}
        <div className="absolute bottom-[-30px] left-0 right-0 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500"
            onClick={handleDislike}
            disabled={loadingNearby || !currentProfile || createConnection.isPending}
          >
            <i className="fas fa-times text-xl"></i>
          </Button>
          <Button 
            className="w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center text-white"
            size="icon"
            onClick={handleLike}
            disabled={loadingNearby || !currentProfile || createConnection.isPending}
          >
            <i className="fas fa-heart text-2xl"></i>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-500"
            onClick={handleSuper}
            disabled={loadingNearby || !currentProfile || createConnection.isPending}
          >
            <i className="fas fa-star text-xl"></i>
          </Button>
        </div>
      </div>

      {/* Matches Section */}
      <div className="mt-16">
        <h3 className="text-xl font-heading font-semibold mb-4">Le tue connessioni</h3>
        
        {loadingMatches ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : !matches || matches.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <i className="fas fa-users text-3xl text-neutral-400 mb-3"></i>
            <h4 className="text-lg font-medium mb-2">Nessuna connessione ancora</h4>
            <p className="text-neutral-500 mb-4">Inizia a esplorare per trovare altre donne con interessi simili ai tuoi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {matches.map((match) => (
              <MatchItem key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
