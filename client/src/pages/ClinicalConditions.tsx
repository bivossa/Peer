import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ClinicalConditions() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/clinical/categories'],
  });

  // Fetch conditions based on selected category
  const { data: conditions = [] } = useQuery({
    queryKey: ['/api/clinical/conditions', selectedCategory],
    queryFn: () => {
      const url = selectedCategory 
        ? `/api/clinical/conditions?categoryId=${selectedCategory}`
        : '/api/clinical/conditions';
      return fetch(url).then(res => res.json());
    },
    enabled: true,
  });

  // Fetch single condition details
  const { data: conditionDetails } = useQuery({
    queryKey: ['/api/clinical/conditions', selectedCondition],
    queryFn: () => {
      return fetch(`/api/clinical/conditions/${selectedCondition}`).then(res => res.json());
    },
    enabled: !!selectedCondition,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommonnessLabel = (commonness: string) => {
    switch (commonness) {
      case 'rare': return 'Rara';
      case 'occasional': return 'Occasionale';
      case 'common': return 'Comune';
      default: return commonness;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Database di Condizioni Cliniche</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Consulta immagini e informazioni sulle condizioni cliniche più comuni per riconoscere e comprendere i sintomi
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Categorie</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-md transition-colors",
                  selectedCategory === null 
                    ? "bg-primary text-white" 
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                Tutte le condizioni
              </button>
              
              {categories.map((category: any) => (
                <button 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-md transition-colors",
                    selectedCategory === category.id 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedCondition && conditionDetails ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64 w-full">
                <img 
                  src={conditionDetails.image} 
                  alt={conditionDetails.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{conditionDetails.name}</h2>
                  <div className="flex space-x-2">
                    <Badge className={getSeverityColor(conditionDetails.severity)}>
                      {conditionDetails.severity === 'low' ? 'Lieve' : 
                       conditionDetails.severity === 'medium' ? 'Moderata' : 'Grave'}
                    </Badge>
                    <Badge variant="outline">
                      {getCommonnessLabel(conditionDetails.commonness)}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">{conditionDetails.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Sintomi comuni</h3>
                  <p className="text-gray-700">{conditionDetails.symptoms}</p>
                </div>
                
                {conditionDetails.treatmentInfo && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Trattamenti</h3>
                    <p className="text-gray-700">{conditionDetails.treatmentInfo}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedCondition(null)}
                  className="mt-4 text-primary hover:underline font-medium"
                >
                  ← Torna all'elenco
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conditions.map((condition: any) => (
                <Card 
                  key={condition.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCondition(condition.id)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={condition.image} 
                      alt={condition.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{condition.name}</CardTitle>
                    <div className="flex space-x-2 mt-2">
                      <Badge className={getSeverityColor(condition.severity)} variant="secondary">
                        {condition.severity === 'low' ? 'Lieve' : 
                         condition.severity === 'medium' ? 'Moderata' : 'Grave'}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}