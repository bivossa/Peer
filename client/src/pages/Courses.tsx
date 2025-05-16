import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['/api/courses/categories'],
  });

  const { data: featuredCourses, isLoading: loadingFeatured } = useQuery({
    queryKey: ['/api/courses', { featured: true }],
  });

  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ['/api/courses', { categoryId: activeCategory }],
  });

  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-semibold">Corsi ed educazione</h2>
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Cerca corsi..." 
            className="pl-10 pr-4 py-2 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
        </div>
      </div>

      {/* Course categories */}
      <div className="flex mb-6 overflow-x-auto custom-scrollbar space-x-3">
        <Button 
          variant={activeCategory === null ? "default" : "secondary"}
          className={`rounded-full ${activeCategory === null ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' : 'bg-gray-100 text-neutral-700 hover:bg-gray-200'}`}
          onClick={() => setActiveCategory(null)}
        >
          Tutti i corsi
        </Button>
        
        {loadingCategories ? (
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-24 h-9 rounded-full" />
            ))}
          </div>
        ) : (
          categories?.map((category) => (
            <Button 
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              className={`rounded-full ${activeCategory === category.id ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' : 'bg-gray-100 text-neutral-700 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              {category.name}
            </Button>
          ))
        )}
      </div>

      {/* Featured courses */}
      {!activeCategory && (
        <>
          <h3 className="text-xl font-heading font-semibold mb-4">Corsi in evidenza</h3>
          
          {loadingFeatured ? (
            <div className="relative rounded-xl overflow-hidden h-60 mb-6 bg-gray-100">
              <Skeleton className="h-full w-full" />
            </div>
          ) : featuredCourses && featuredCourses.length > 0 ? (
            <div className="relative rounded-xl overflow-hidden h-60 mb-6 bg-cover bg-center" style={{ backgroundImage: `url('${featuredCourses[0].image}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <Badge className="bg-primary-500 text-white mb-2">PIÙ POPOLARE</Badge>
                <h3 className="text-2xl font-semibold mb-1">{featuredCourses[0].title}</h3>
                <p className="text-gray-200 mb-2">
                  {featuredCourses[0].duration} • {featuredCourses[0].rating}/5 ({featuredCourses[0].ratingCount} recensioni)
                </p>
                <Button className="bg-white text-primary-600 hover:bg-gray-100">Scopri di più</Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingCourses ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : !filteredCourses || filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
            <i className="fas fa-graduation-cap text-4xl text-neutral-300 mb-4"></i>
            <h3 className="text-xl font-medium mb-2">Nessun corso trovato</h3>
            <p className="text-neutral-500">Prova a modificare i criteri di ricerca</p>
          </div>
        ) : (
          filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
        )}
      </div>
    </section>
  );
}
