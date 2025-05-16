import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { useQuery } from "@tanstack/react-query";

interface ProfessionalCardProps {
  professional: any; // Using 'any' for simplicity, in real app would use proper type
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const { data: specialty } = useQuery({
    queryKey: ['/api/professionals/specialties', professional.specialtyId],
    enabled: !!professional.specialtyId,
  });
  
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(professional.rating);
    const halfStar = professional.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (halfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 md:p-6 md:flex">
        <div className="md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
          <ProfileAvatar 
            src={professional.avatar}
            name={professional.name}
            size="xl"
            bordered
            borderColor="border-secondary-100"
          />
          <h3 className="font-medium text-lg mt-2">{professional.name}</h3>
          <p className="text-secondary-600 font-medium">{specialty?.name || "Specialista"}</p>
          <div className="flex text-yellow-400 mt-1">
            {renderStars()}
            <span className="text-neutral-600 ml-1">({professional.ratingCount})</span>
          </div>
        </div>
        
        <div className="md:w-2/4 md:pl-6 md:border-l md:border-r border-gray-200">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 mb-1">Specializzazioni</h4>
              <div className="flex flex-wrap gap-2">
                {professional.specializations.map((spec: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-secondary-700">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 mb-1">Esperienza</h4>
              <p className="text-sm text-neutral-700">{professional.bio}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 mb-1">Lingue</h4>
              <p className="text-sm text-neutral-700">{professional.languages.join(", ")}</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/4 md:pl-6 mt-4 md:mt-0">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-neutral-500 mb-1">Indirizzo</h4>
            <p className="text-sm text-neutral-700">{professional.address}</p>
            <p className="text-sm text-neutral-500">1.2 km di distanza</p>
          </div>
          
          <div className="space-y-2">
            <Button className="w-full bg-primary text-white">Prenota visita</Button>
            <Button variant="outline" className="w-full border-primary-400 text-primary-500">
              Visualizza profilo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
