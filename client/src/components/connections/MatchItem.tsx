import ProfileAvatar from "@/components/common/ProfileAvatar";

interface MatchItemProps {
  match: any; // Using 'any' for simplicity, in real app would use proper type
}

export default function MatchItem({ match }: MatchItemProps) {
  if (!match) return null;

  // Determine which interest to show under the name
  const mainInterest = match.interests && match.interests.length > 0 
    ? match.interests[0] 
    : "Nuovo match";

  return (
    <div className="text-center">
      <div className="mx-auto mb-2">
        <ProfileAvatar 
          src={match.avatar}
          name={match.name}
          size="lg"
          bordered
        />
      </div>
      <h4 className="font-medium text-sm">{match.name}</h4>
      <span className="text-xs text-neutral-500">{mainInterest}</span>
    </div>
  );
}
