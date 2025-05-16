import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface CourseCardProps {
  course: any; // Using 'any' for simplicity, in real app would use proper type
}

export default function CourseCard({ course }: CourseCardProps) {
  const { data: category } = useQuery({
    queryKey: ['/api/courses/categories', course.categoryId],
    enabled: !!course.categoryId,
  });
  
  // Format price from cents to euros
  const formattedPrice = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(course.price / 100);
  
  // Determine badge color based on category
  let badgeColor = "primary";
  if (category) {
    if (category.name.toLowerCase().includes("menopaus")) {
      badgeColor = "accent";
    } else if (category.name.toLowerCase().includes("post")) {
      badgeColor = "primary";
    } else {
      badgeColor = "secondary";
    }
  }
  
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(course.rating);
    const halfStar = course.rating % 1 >= 0.5;
    
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
    <Card className="overflow-hidden shadow-lg">
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ backgroundImage: `url('${course.image}')` }}
      ></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant={badgeColor as "default" | "secondary" | "destructive" | "outline"}
          >
            {category?.name || "Corso"}
          </Badge>
          <span className="text-neutral-500 text-sm">{formattedPrice}</span>
        </div>
        <h3 className="text-lg font-medium mb-1">{course.title}</h3>
        <p className="text-neutral-500 text-sm mb-2">{course.description}</p>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {renderStars()}
          </div>
          <span className="text-sm text-neutral-500 ml-1">
            {course.rating.toFixed(1)} ({course.ratingCount})
          </span>
        </div>
        <div className="flex items-center text-neutral-500 text-sm justify-between">
          <span><i className="far fa-clock mr-1"></i> {course.duration}</span>
          <Button variant="link" className="text-primary-500 font-medium p-0">Dettagli</Button>
        </div>
      </CardContent>
    </Card>
  );
}
