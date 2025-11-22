import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ShowCard } from "@/components/show-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Show } from "@shared/schema";

const categoryMap: Record<string, { name: string; genres: string[] }> = {
  action: { name: "Action & Thriller", genres: ["Action", "Thriller"] },
  drama: { name: "Drama & Romance", genres: ["Drama", "Romance"] },
  comedy: { name: "Comedy", genres: ["Comedy"] },
  horror: { name: "Horror & Mystery", genres: ["Horror", "Mystery"] },
};

export default function Category() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";

  const { data: shows, isLoading } = useQuery<Show[]>({
    queryKey: ["/api/shows"],
  });

  const categoryInfo = categoryMap[slug];

  const categoryShows = shows?.filter((show) =>
    show.genres.some((genre) => categoryInfo?.genres.includes(genre))
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(15)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-8"
          data-testid="text-category-title"
        >
          {categoryInfo.name}
        </h1>

        {categoryShows.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoryShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No shows found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
