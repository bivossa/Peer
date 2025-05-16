import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ForumPostProps {
  post: any; // Using 'any' for simplicity, in real app would use proper type
}

export default function ForumPost({ post }: ForumPostProps) {
  const { data: category } = useQuery({
    queryKey: ['/api/forum/categories', post.categoryId],
    enabled: !!post.categoryId,
  });
  
  const { data: user } = useQuery({
    queryKey: ['/api/users', post.userId],
    enabled: !!post.userId,
  });
  
  const formattedTime = post.createdAt ? 
    formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: it }) :
    "";
  
  const score = post.upvotes - post.downvotes;
  
  // Determine badge color based on category
  let badgeColor = "primary";
  if (category) {
    if (category.name.toLowerCase().includes("menopaus")) {
      badgeColor = "secondary";
    } else if (category.name.toLowerCase().includes("salute")) {
      badgeColor = "accent";
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center space-y-2 pt-1">
          <button className="text-neutral-400 hover:text-primary-400">
            <i className="fas fa-arrow-up"></i>
          </button>
          <span className="text-sm font-medium">{score}</span>
          <button className="text-neutral-400 hover:text-neutral-700">
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center text-xs text-neutral-500 mb-1">
            <Badge 
              variant={badgeColor as "default" | "secondary" | "destructive" | "outline"} 
              className="mr-2"
            >
              {category?.name || "Categoria"}
            </Badge>
            <span>
              Postato da <span className="font-medium">{user?.username || "utente"}</span> • {formattedTime}
            </span>
          </div>
          <h3 className="text-lg font-medium mb-2">{post.title}</h3>
          <p className="text-neutral-700 mb-3">{post.content}</p>
          <div className="flex items-center text-neutral-500 text-sm">
            <button className="flex items-center mr-4 hover:text-primary-500">
              <i className="far fa-comment mr-1"></i>
              <span>{post.commentCount || 0} commenti</span>
            </button>
            <button className="flex items-center mr-4 hover:text-primary-500">
              <i className="far fa-bookmark mr-1"></i>
              <span>Salva</span>
            </button>
            <button className="flex items-center hover:text-primary-500">
              <i className="fas fa-share-alt mr-1"></i>
              <span>Condividi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
