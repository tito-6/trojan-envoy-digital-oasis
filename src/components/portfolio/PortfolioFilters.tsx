
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const PortfolioFilters: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filters = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "marketing", label: "Digital Marketing" },
    { id: "branding", label: "Branding" }
  ];
  
  return (
    <section className="pb-8 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 should-animate">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="mb-2"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioFilters;
