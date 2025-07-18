import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { ChevronRight } from 'lucide-react';
import { serviceCategories } from './constants';

export function ServiceCategories() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse Services by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find the perfect service for your needs from our wide range of categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.title}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="text-sm font-medium text-primary">
                    {category.services}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
} 