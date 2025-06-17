import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfessionalCard from "@/components/professionals/ProfessionalCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin } from "lucide-react";
import { useLocation } from "@/hooks/use-location";

export default function Professionals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const { userLocation } = useLocation();
  
  const { data: specialties, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['/api/professionals/specialties'],
  });
  
  const { data: professionals, isLoading: loadingProfessionals } = useQuery({
    queryKey: ['/api/professionals', { 
      specialtyId: specialty && specialty !== 'all' ? parseInt(specialty) : undefined,
      ...(userLocation ? {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        radius: 10
      } : {})
    }],
  });
  
  const filteredProfessionals = Array.isArray(professionals) ? professionals.filter((pro: any) => 
    pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pro.specializations.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];
  
  const handleSearch = () => {
    // In a real app, this would trigger the query with new parameters
    console.log("Searching with:", { searchQuery, location, specialty });
  };

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-semibold">Professionisti sanitari</h2>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Cerca per nome o specialità..." 
              className="w-full pl-10 pr-4 py-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          </div>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Località" 
              className="w-full pl-10 pr-4 py-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
          </div>
          <div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le specialità</SelectItem>
                {loadingSpecialties ? (
                  <SelectItem disabled value="loading">Caricamento...</SelectItem>
                ) : (
                  Array.isArray(specialties) ? (specialties as any[]).map((spec: any) => (
                    <SelectItem key={spec.id} value={spec.id.toString()}>
                      {spec.name}
                    </SelectItem>
                  )) : []
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="bg-primary text-white" onClick={handleSearch}>Cerca</Button>
        </div>
      </div>

      {/* Professional card list */}
      <div className="space-y-4">
        {loadingProfessionals ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="md:flex">
                <div className="md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-6 w-32 mt-2" />
                  <Skeleton className="h-4 w-24 mt-1" />
                  <Skeleton className="h-4 w-28 mt-1" />
                </div>
                <div className="md:w-2/4 md:pl-6 md:border-l md:border-r border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-28" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="md:w-1/4 md:pl-6 mt-4 md:mt-0">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-4 w-28 mb-4" />
                  <Skeleton className="h-10 w-full mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))
        ) : !filteredProfessionals || filteredProfessionals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <i className="fas fa-stethoscope text-4xl text-neutral-300 mb-4"></i>
            <h3 className="text-xl font-medium mb-2">Nessun professionista trovato</h3>
            <p className="text-neutral-500">Prova a modificare i criteri di ricerca</p>
          </div>
        ) : (
          filteredProfessionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))
        )}
      </div>

      {/* Load more button */}
      {filteredProfessionals && filteredProfessionals.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-primary-400 text-primary-500">
            Carica altri professionisti
          </Button>
        </div>
      )}
    </section>
  );
}
