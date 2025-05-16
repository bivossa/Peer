import { cn } from "@/lib/utils";

interface ConnectionCardProps {
  profile: any; // Using 'any' for simplicity, in real app would use proper type
  className?: string;
}

export default function ConnectionCard({ profile, className }: ConnectionCardProps) {
  if (!profile) return null;

  return (
    <div 
      className={cn(
        "absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-cover bg-center",
        className
      )}
      style={{ backgroundImage: `url('${profile.avatar}')` }}
    >
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-semibold mb-1">{profile.name}, {profile.age}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.interests && profile.interests.map((interest: string, i: number) => (
                <span 
                  key={i} 
                  className={cn(
                    "px-2 py-1 rounded text-white text-sm",
                    i % 2 === 0 ? "bg-primary-400/80" : "bg-secondary-400/80"
                  )}
                >
                  {interest}
                </span>
              ))}
            </div>
            <p className="text-gray-200">{profile.bio}</p>
          </div>
          {profile.distance && (
            <div className="flex flex-col space-y-2">
              <span className="inline-flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {profile.distance} km
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
