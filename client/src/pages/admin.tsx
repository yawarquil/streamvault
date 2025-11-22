import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Save, X, Upload, FileJson, LogOut } from "lucide-react";
import type { Show, Episode } from "@shared/schema";
import { getAuthHeaders, logout as authLogout } from "@/lib/auth";

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("shows");
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setLocation("/admin/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/verify", {
          headers: { "x-admin-token": token },
        });
        const data = await res.json();

        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminToken");
          setLocation("/admin/login");
        }
      } catch (error) {
        localStorage.removeItem("adminToken");
        setLocation("/admin/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    await authLogout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    setLocation("/admin/login");
  };

  // Fetch all shows
  const { data: shows = [] } = useQuery<Show[]>({
    queryKey: ["/api/shows"],
  });

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your StreamVault content</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="shows">Shows</TabsTrigger>
            <TabsTrigger value="add-show">Add Show</TabsTrigger>
            <TabsTrigger value="add-episode">Add Episode</TabsTrigger>
            <TabsTrigger value="import">Import Episodes</TabsTrigger>
          </TabsList>

          {/* Manage Shows Tab */}
          <TabsContent value="shows">
            <ManageShows shows={shows} />
          </TabsContent>

          {/* Add Show Tab */}
          <TabsContent value="add-show">
            <AddShowForm />
          </TabsContent>

          {/* Add Episode Tab */}
          <TabsContent value="add-episode">
            <AddEpisodeForm shows={shows} />
          </TabsContent>

          {/* Import Episodes Tab */}
          <TabsContent value="import">
            <ImportEpisodesForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Manage Shows Component
function ManageShows({ shows }: { shows: Show[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (showId: string) => {
      const res = await fetch(`/api/admin/shows/${showId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete show");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shows"] });
      toast({
        title: "Success",
        description: "Show deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete show",
        variant: "destructive",
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/shows`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete all shows");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/shows"] });
      setShowDeleteAllConfirm(false);
      toast({
        title: "Success",
        description: `Deleted ${data.deleted} shows and their episodes`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete all shows",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Show> }) => {
      const res = await fetch(`/api/admin/shows/${data.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data.updates),
      });
      if (!res.ok) throw new Error("Failed to update show");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shows"] });
      setIsEditDialogOpen(false);
      setEditingShow(null);
      toast({
        title: "Success",
        description: "Show updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update show",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (show: Show) => {
    setEditingShow(show);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (showId: string, showTitle: string) => {
    if (confirm(`Are you sure you want to delete "${showTitle}"? This will also delete all episodes.`)) {
      deleteMutation.mutate(showId);
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Shows ({shows.length})</CardTitle>
              <CardDescription>Manage your content library</CardDescription>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteAllConfirm(true)}
              disabled={shows.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Shows
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shows.map((show) => (
              <div
                key={show.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={show.posterUrl}
                    alt={show.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{show.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {show.year} • {show.totalSeasons} Season(s) • {show.rating}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {show.genres.slice(0, 3).map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(show)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(show.id, show.title)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={showDeleteAllConfirm} onOpenChange={setShowDeleteAllConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Shows?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {shows.length} shows and their episodes. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteAllConfirm(false)}
              disabled={deleteAllMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAllMutation.mutate()}
              disabled={deleteAllMutation.isPending}
            >
              {deleteAllMutation.isPending ? "Deleting..." : "Delete All"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Show</DialogTitle>
            <DialogDescription>
              Update show information
            </DialogDescription>
          </DialogHeader>
          {editingShow && (
            <EditShowForm 
              show={editingShow} 
              onSave={(updates) => updateMutation.mutate({ id: editingShow.id, updates })}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Show Form Component
function EditShowForm({ show, onSave, onCancel, isLoading }: { 
  show: Show; 
  onSave: (updates: Partial<Show>) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: show.title,
    description: show.description,
    posterUrl: show.posterUrl,
    backdropUrl: show.backdropUrl,
    year: show.year,
    rating: show.rating,
    imdbRating: show.imdbRating || "",
    genres: show.genres.join(", "),
    language: show.language,
    totalSeasons: show.totalSeasons,
    cast: show.cast?.join(", ") || "",
    creators: show.creators?.join(", ") || "",
    featured: show.featured || false,
    trending: show.trending || false,
    category: show.category || "action",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      genres: formData.genres.split(",").map((g) => g.trim()),
      cast: formData.cast.split(",").map((c) => c.trim()).filter(Boolean),
      creators: formData.creators.split(",").map((c) => c.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-year">Year</Label>
          <Input
            id="edit-year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-posterUrl">Poster URL</Label>
          <Input
            id="edit-posterUrl"
            value={formData.posterUrl}
            onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-backdropUrl">Backdrop URL</Label>
          <Input
            id="edit-backdropUrl"
            value={formData.backdropUrl}
            onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-rating">Rating</Label>
          <select
            id="edit-rating"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          >
            <option value="TV-Y">TV-Y</option>
            <option value="TV-Y7">TV-Y7</option>
            <option value="TV-G">TV-G</option>
            <option value="TV-PG">TV-PG</option>
            <option value="TV-14">TV-14</option>
            <option value="TV-MA">TV-MA</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-imdbRating">IMDb Rating</Label>
          <Input
            id="edit-imdbRating"
            value={formData.imdbRating}
            onChange={(e) => setFormData({ ...formData, imdbRating: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-totalSeasons">Total Seasons</Label>
          <Input
            id="edit-totalSeasons"
            type="number"
            min="1"
            value={formData.totalSeasons}
            onChange={(e) => setFormData({ ...formData, totalSeasons: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-genres">Genres (comma-separated)</Label>
          <Input
            id="edit-genres"
            value={formData.genres}
            onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-language">Language</Label>
          <Input
            id="edit-language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-cast">Cast (comma-separated)</Label>
        <Input
          id="edit-cast"
          value={formData.cast}
          onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.trending}
            onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Trending</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Add Show Form Component
function AddShowForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    posterUrl: "",
    backdropUrl: "",
    year: new Date().getFullYear(),
    rating: "TV-MA",
    imdbRating: "",
    genres: "",
    language: "English",
    totalSeasons: 1,
    cast: "",
    creators: "",
    featured: false,
    trending: false,
    category: "action",
  });

  const addShowMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/shows", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add show");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shows"] });
      toast({
        title: "Success!",
        description: "Show added successfully",
      });
      // Reset form
      setFormData({
        title: "",
        slug: "",
        description: "",
        posterUrl: "",
        backdropUrl: "",
        year: new Date().getFullYear(),
        rating: "TV-MA",
        imdbRating: "",
        genres: "",
        language: "English",
        totalSeasons: 1,
        cast: "",
        creators: "",
        featured: false,
        trending: false,
        category: "action",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from title if not provided
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");
    
    const showData = {
      ...formData,
      slug,
      genres: formData.genres.split(",").map((g) => g.trim()),
      cast: formData.cast.split(",").map((c) => c.trim()),
      creators: formData.creators.split(",").map((c) => c.trim()),
    };

    addShowMutation.mutate(showData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Show</CardTitle>
        <CardDescription>Add a new show to your library</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="posterUrl">Poster URL *</Label>
              <Input
                id="posterUrl"
                type="url"
                value={formData.posterUrl}
                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backdropUrl">Backdrop URL *</Label>
              <Input
                id="backdropUrl"
                type="url"
                value={formData.backdropUrl}
                onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating *</Label>
              <select
                id="rating"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              >
                <option value="TV-Y">TV-Y</option>
                <option value="TV-Y7">TV-Y7</option>
                <option value="TV-G">TV-G</option>
                <option value="TV-PG">TV-PG</option>
                <option value="TV-14">TV-14</option>
                <option value="TV-MA">TV-MA</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imdbRating">IMDb Rating *</Label>
              <Input
                id="imdbRating"
                value={formData.imdbRating}
                onChange={(e) => setFormData({ ...formData, imdbRating: e.target.value })}
                placeholder="8.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genres">Genres (comma-separated) *</Label>
              <Input
                id="genres"
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                placeholder="Action, Drama, Thriller"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalSeasons">Total Seasons *</Label>
              <Input
                id="totalSeasons"
                type="number"
                min="1"
                value={formData.totalSeasons}
                onChange={(e) => setFormData({ ...formData, totalSeasons: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="action">Action & Thriller</option>
                <option value="drama">Drama & Romance</option>
                <option value="comedy">Comedy</option>
                <option value="horror">Horror & Mystery</option>
              </select>
            </div>
            <div className="space-y-2 flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Trending</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cast">Cast (comma-separated) *</Label>
              <Input
                id="cast"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                placeholder="Actor 1, Actor 2, Actor 3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creators">Creators (comma-separated) *</Label>
              <Input
                id="creators"
                value={formData.creators}
                onChange={(e) => setFormData({ ...formData, creators: e.target.value })}
                placeholder="Creator 1, Creator 2"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={addShowMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {addShowMutation.isPending ? "Adding..." : "Add Show"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Add Episode Form Component
function AddEpisodeForm({ shows }: { shows: Show[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    showId: "",
    season: 1,
    episodeNumber: 1,
    title: "",
    description: "",
    thumbnailUrl: "",
    duration: 45,
    googleDriveUrl: "https://drive.google.com/file/d/1zcFHiGEOwgq2-j6hMqpsE0ov7qcIUqCd/preview",
    airDate: new Date().toISOString().split("T")[0],
  });

  const addEpisodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/episodes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add episode");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
      toast({
        title: "Success!",
        description: "Episode added successfully",
      });
      // Reset form
      setFormData({
        ...formData,
        episodeNumber: formData.episodeNumber + 1,
        title: "",
        description: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEpisodeMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Episode</CardTitle>
        <CardDescription>Add episodes to existing shows</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="showId">Select Show *</Label>
            <select
              id="showId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.showId}
              onChange={(e) => setFormData({ ...formData, showId: e.target.value })}
              required
            >
              <option value="">Choose a show...</option>
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="season">Season *</Label>
              <Input
                id="season"
                type="number"
                min="1"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="episodeNumber">Episode Number *</Label>
              <Input
                id="episodeNumber"
                type="number"
                min="1"
                value={formData.episodeNumber}
                onChange={(e) => setFormData({ ...formData, episodeNumber: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Episode Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Episode 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL *</Label>
            <Input
              id="thumbnailUrl"
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airDate">Air Date *</Label>
              <Input
                id="airDate"
                type="date"
                value={formData.airDate}
                onChange={(e) => setFormData({ ...formData, airDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleDriveUrl">Google Drive Video URL *</Label>
            <Input
              id="googleDriveUrl"
              type="url"
              value={formData.googleDriveUrl}
              onChange={(e) => setFormData({ ...formData, googleDriveUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/FILE_ID/preview"
              required
            />
            <p className="text-xs text-muted-foreground">
              Get File ID from Google Drive share link and use format: https://drive.google.com/file/d/FILE_ID/preview
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={addEpisodeMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {addEpisodeMutation.isPending ? "Adding..." : "Add Episode"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Import Episodes Form Component
function ImportEpisodesForm() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState("all_shows_20251120_230844.json");
  const [customPath, setCustomPath] = useState("");
  const [useCustomPath, setUseCustomPath] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const baseFolder = "C:\\Users\\yawar\\Desktop\\worthcrete_extracted";
  
  // Available JSON files in the folder
  const availableFiles = [
    "all_shows_20251120_230844.json",
    "adamas-online-hindi-dubbed.json",
    "all-i-want-for-love-is-you-online-hindi-dubbed.json",
    "aurora-teagarden-mysteries-online-hindi-dubbed.json",
    "berlin-online-hindi-dubbed.json",
    "big-mouth-tv-series-online-hindi-dubbed.json",
    "blanca-online-hindi-dubbed.json",
    "chilling-adventures-of-sabrina-online-hindi-dubbed.json",
    "creature-online-hindi-dubbed.json",
    "descendants-of-the-sun-online-hindi-dubbed.json",
    "dont-be-shy-online-hindi-dubbed.json",
    "exploration-method-of-love-tv-series-online-hindi-dubbed.json",
    "fake-it-till-you-make-it-tv-series-online-hindi-dubbed.json",
    "feria-the-darkest-light-online-hindi-dubbed.json",
    "fool-me-once-online-hindi-dubbed.json",
    "furies-online-hindi-dubbed.json",
    "gyeongseong-creature-online-hindi-dubbed.json",
    "hear-me-tv-series-online-hindi-dubbed.json",
    "house-of-ninjas-online-hindi-dubbed.json",
    "i-can-see-you-shine-tv-series-online-hindi-dubbed.json",
    "im-not-a-robot-online-hindi-dubbed.json",
    "into-the-badlands-online-hindi-dubbed.json",
    "inventing-anna-online-hindi-dubbed.json",
    "juvenile-justice-online-hindi-dubbed.json",
    "last-one-standing-online-hindi-dubbed.json",
    "lawless-lawyer-tv-series-online-hindi-dubbed.json",
    "life-tv-series-online-hindi-dubbed.json",
    "love-puzzle-tv-series-online-hindi-dubbed.json",
    "lover-or-stranger-tv-series-online-hindi-dubbed.json",
    "lucifer-online-hindi-dubbed.json",
    "lupin-online-hindi-dubbed.json",
    "marry-my-husband-online-hindi-dubbed.json",
    "midnight-at-the-pera-palace-online-hindi-dubbed.json",
    "misty-online-hindi-dubbed.json",
    "money-flower-online-hindi-dubbed.json",
    "mr-queen-online-hindi-dubbed.json",
    "my-dearest-tv-series-online-hindi-dubbed.json",
    "my-family-online-hindi-dubbed.json",
    "my-lethal-man-online-hindi-dubbed.json",
    "one-dollar-lawyer-online-hindi-dubbed.json",
    "orange-is-the-new-black-online-hindi-dubbed.json",
    "over-water-tv-series-online-hindi-dubbed.json",
    "penthouse-online-hindi-dubbed.json",
    "pride-and-prejudice-tv-series-online-hindi-dubbed.json",
    "queen-of-mystery-online-hindi-dubbed.json",
    "queenmaker-online-hindi-dubbed.json",
    "sebastian-fitzeks-therapy-online-hindi-dubbed.json",
    "sherlock-the-russian-chronicles-online-hindi-dubbed.json",
    "sketch-online-hindi-dubbed.json",
    "snowfall-tv-series-online-hindi-dubbed.json",
    "song-of-the-bandits-online-hindi-dubbed.json",
    "stranger-tv-series-online-hindi-dubbed.json",
    "tempted-online-hindi-dubbed.json",
    "the-deceived-tv-series-online-hindi-dubbed.json",
    "the-divorce-insurance-tv-series-online-hindi-dubbed.json",
    "the-ghost-detective-tv-series-online-hindi-dubbed.json",
    "the-helicopter-heist-tv-series-online-hindi-dubbed.json",
    "the-untamed-online-hindi-dubbed.json",
    "the-witcher-blood-origin-online-hindi-dubbed.json",
    "the-witcher-online-hindi-dubbed.json",
    "tientsin-mystic-online-hindi-dubbed.json",
    "victor-lessard-tv-series-online-hindi-dubbed.json",
    "vikings-online-hindi-dubbed.json",
    "vincenzo-online-hindi-dubbed.json",
    "wenderellas-diary-tv-series-online-hindi-dubbed.json",
  ];
  
  const getFilePath = () => {
    if (useCustomPath) {
      return customPath;
    }
    return `${baseFolder}\\${selectedFile}`;
  };

  const importMutation = useMutation({
    mutationFn: async (path: string) => {
      const res = await fetch("/api/admin/import-shows-episodes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ filePath: path }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.details || "Failed to import");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setImportResult(data.summary);
      toast({
        title: "Import Completed!",
        description: `Created ${data.summary.showsCreated} shows and imported ${data.summary.episodesImported} episodes`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportResult(null);
    importMutation.mutate(getFilePath());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="w-5 h-5" />
          Import Episodes from JSON
        </CardTitle>
        <CardDescription>
          Import shows and episodes from the extracted JSON file. Creates shows if they don't exist and adds all episodes automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleImport} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useCustomPath"
                checked={useCustomPath}
                onChange={(e) => setUseCustomPath(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="useCustomPath" className="cursor-pointer">
                Use custom file path
              </Label>
            </div>

            {!useCustomPath ? (
              <div className="space-y-2">
                <Label htmlFor="fileSelect">Select JSON File *</Label>
                <select
                  id="fileSelect"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  required
                >
                  {availableFiles.map((file) => (
                    <option key={file} value={file}>
                      {file}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Folder: {baseFolder}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="customPath">Custom File Path *</Label>
                <Input
                  id="customPath"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="C:\\Users\\yawar\\Desktop\\worthcrete_extracted\\all_shows_20251120_230844.json"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full path to the JSON file
                </p>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={importMutation.isPending}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {importMutation.isPending ? "Importing..." : "Start Import"}
          </Button>
        </form>

        {importMutation.isPending && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Importing episodes... This may take a few moments.
            </p>
          </div>
        )}

        {importResult && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                ✅ Import Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Shows Created:</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {importResult.showsCreated}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Shows Skipped:</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {importResult.showsSkipped}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Episodes Imported:</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {importResult.episodesImported}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Episodes Skipped:</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {importResult.episodesSkipped}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
