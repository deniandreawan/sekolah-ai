"use client";

import * as React from "react";
import { Hero } from "../components/hero";
import { Content } from "../components/content";
import { Footer } from "../components/footer";
import { data } from "@/lib/data";

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(data);

  const handleSearch = (event: any) => {
    const term = event.target.value;
    setSearchTerm(term);

    const results: any = data.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
  };

  return (
    <div className="relative overflow-hidden">
      <Hero value={searchTerm} onChange={handleSearch} />

      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((item: any) => (
            <Content
              key={item.id}
              id={String(item.id)}
              title={item.title}
              descriptions={item.desriptions}
              category={item.category}
              image={item.image}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
