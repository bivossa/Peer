import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ForumPost from "@/components/forum/ForumPost";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Forum() {
  const [activeTab, setActiveTab] = useState("popular");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['/api/forum/categories'],
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['/api/forum/posts', { sortBy: activeTab, categoryId: activeCategory }],
  });

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-semibold">Forum della comunità</h2>
        <Button className="bg-primary text-white">
          <i className="fas fa-plus mr-1"></i> Nuovo post
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex mb-6 border-b overflow-x-auto custom-scrollbar">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'popular' ? 'text-primary-500 border-b-2 border-primary-400' : 'text-neutral-500'}`}
          onClick={() => setActiveTab('popular')}
        >
          Popolari
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'recent' ? 'text-primary-500 border-b-2 border-primary-400' : 'text-neutral-500'}`}
          onClick={() => setActiveTab('recent')}
        >
          Recenti
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'followed' ? 'text-primary-500 border-b-2 border-primary-400' : 'text-neutral-500'}`}
          onClick={() => setActiveTab('followed')}
        >
          Seguiti
        </button>
        
        {loadingCategories ? (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-24 h-9" />
            ))}
          </div>
        ) : (
          categories?.map((category) => (
            <button 
              key={category.id}
              className={`px-4 py-2 text-sm font-medium ${activeCategory === category.id ? 'text-primary-500 border-b-2 border-primary-400' : 'text-neutral-500'}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {loadingPosts ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center space-y-2 pt-1">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : !posts || posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <i className="fas fa-comments text-4xl text-neutral-300 mb-4"></i>
            <h3 className="text-xl font-medium mb-2">Nessun post trovato</h3>
            <p className="text-neutral-500 mb-4">Sii la prima a iniziare una discussione in questa categoria</p>
            <Button>Crea un nuovo post</Button>
          </div>
        ) : (
          posts.map((post) => <ForumPost key={post.id} post={post} />)
        )}
      </div>
    </section>
  );
}
