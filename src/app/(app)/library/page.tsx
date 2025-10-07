'use client';

import {
  BookOpen,
  Search,
  Filter,
  Download,
  Star,
  Clock,
  Calendar,
  User,
  Bookmark,
  ExternalLink,
  FileText,
  Video,
  Headphones,
  Image,
  Archive,
  Database,
  Globe,
  Library,
  TrendingUp,
  BarChart3,
  Award,
  Bell,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  Tag,
  BookMarked,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthUser } from '@/hooks/use-auth-user';

interface LibraryResource {
  id: string;
  title: string;
  description: string;
  type: 'book' | 'ebook' | 'journal' | 'video' | 'audio' | 'document' | 'dataset' | 'website';
  category: string;
  subcategory: string;
  author: string;
  publisher?: string;
  publishedDate?: Date;
  isbn?: string;
  doi?: string;
  url?: string;
  downloadUrl?: string;
  fileSize?: string;
  pages?: number;
  duration?: string;
  language: string;
  rating: number;
  downloads: number;
  views: number;
  bookmarks: number;
  tags: string[];
  isBookmarked: boolean;
  isLiked: boolean;
  accessLevel: 'free' | 'premium' | 'restricted';
  availability: 'available' | 'borrowed' | 'reserved';
  dueDate?: Date;
  addedDate: Date;
  lastAccessed?: Date;
}

interface LibraryCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
}

interface LibraryStatistics {
  totalResources: number;
  borrowedResources: number;
  reservedResources: number;
  bookmarkedResources: number;
  downloadedResources: number;
  favoriteCategories: string[];
  recentActivity: {
    type: 'borrowed' | 'downloaded' | 'bookmarked' | 'viewed';
    resourceTitle: string;
    date: Date;
  }[];
  readingStreak: number;
  totalReadingTime: number; // in hours
}

export default function LibraryPage() {
  const { user, loading } = useAuthUser();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [statistics, setStatistics] = useState<LibraryStatistics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'browse' | 'myLibrary'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  useEffect(() => {
    // Mock library data - in real app, this would come from API
    const mockResources: LibraryResource[] = [
      {
        id: '1',
        title: 'Introduction to Algorithms',
        description: 'Comprehensive introduction to algorithms and data structures, covering design techniques, analysis, and implementation.',
        type: 'book',
        category: 'Computer Science',
        subcategory: 'Algorithms',
        author: 'Thomas H. Cormen',
        publisher: 'MIT Press',
        publishedDate: new Date('2022-07-01'),
        isbn: '978-0262033848',
        pages: 1312,
        language: 'English',
        rating: 4.8,
        downloads: 15420,
        views: 45230,
        bookmarks: 3421,
        tags: ['algorithms', 'data-structures', 'programming', 'computer-science'],
        isBookmarked: true,
        isLiked: false,
        accessLevel: 'free',
        availability: 'available',
        addedDate: new Date('2025-09-01'),
        lastAccessed: new Date('2025-10-04'),
      },
      {
        id: '2',
        title: 'Web Development Complete Course',
        description: 'Complete video course covering HTML, CSS, JavaScript, React, and modern web development practices.',
        type: 'video',
        category: 'Web Development',
        subcategory: 'Full Stack',
        author: 'Dr. Emily Davis',
        duration: '42 hours',
        language: 'English',
        rating: 4.6,
        downloads: 8934,
        views: 28456,
        bookmarks: 2156,
        tags: ['web-dev', 'html', 'css', 'javascript', 'react'],
        isBookmarked: false,
        isLiked: true,
        accessLevel: 'premium',
        availability: 'available',
        url: 'https://video-library.example.com/web-dev-course',
        addedDate: new Date('2025-08-15'),
        lastAccessed: new Date('2025-10-03'),
      },
      {
        id: '3',
        title: 'Database Systems: The Complete Book',
        description: 'Comprehensive coverage of database systems, including design, implementation, and management.',
        type: 'ebook',
        category: 'Database',
        subcategory: 'Database Design',
        author: 'Hector Garcia-Molina',
        publisher: 'Pearson',
        publishedDate: new Date('2021-03-15'),
        isbn: '978-0133970777',
        pages: 1144,
        language: 'English',
        rating: 4.5,
        downloads: 12450,
        views: 38920,
        bookmarks: 2890,
        tags: ['database', 'sql', 'data-modeling', 'dbms'],
        isBookmarked: true,
        isLiked: true,
        accessLevel: 'free',
        availability: 'borrowed',
        dueDate: new Date('2025-10-20'),
        addedDate: new Date('2025-09-10'),
        lastAccessed: new Date('2025-10-05'),
      },
      {
        id: '4',
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
        type: 'document',
        category: 'Artificial Intelligence',
        subcategory: 'Machine Learning',
        author: 'Prof. Michael Chen',
        pages: 156,
        language: 'English',
        rating: 4.7,
        downloads: 6789,
        views: 19876,
        bookmarks: 1234,
        tags: ['machine-learning', 'ai', 'algorithms', 'data-science'],
        isBookmarked: false,
        isLiked: false,
        accessLevel: 'free',
        availability: 'available',
        downloadUrl: '/downloads/ml-fundamentals.pdf',
        fileSize: '5.2 MB',
        addedDate: new Date('2025-09-20'),
      },
      {
        id: '5',
        title: 'Academic Writing Podcast Series',
        description: 'Audio series covering academic writing techniques, research methods, and publication strategies.',
        type: 'audio',
        category: 'Academic Skills',
        subcategory: 'Writing',
        author: 'Dr. James Miller',
        duration: '8 hours',
        language: 'English',
        rating: 4.3,
        downloads: 3456,
        views: 8901,
        bookmarks: 567,
        tags: ['writing', 'research', 'academic', 'publication'],
        isBookmarked: false,
        isLiked: false,
        accessLevel: 'free',
        availability: 'available',
        downloadUrl: '/downloads/writing-podcast.zip',
        fileSize: '125 MB',
        addedDate: new Date('2025-08-25'),
      },
      {
        id: '6',
        title: 'Computer Graphics Programming',
        description: 'Advanced computer graphics programming with OpenGL and modern GPU techniques.',
        type: 'dataset',
        category: 'Graphics',
        subcategory: 'Programming',
        author: 'Dr. Sarah Johnson',
        language: 'English',
        rating: 4.4,
        downloads: 2345,
        views: 7890,
        bookmarks: 432,
        tags: ['graphics', 'opengl', 'gpu', 'programming'],
        isBookmarked: true,
        isLiked: false,
        accessLevel: 'restricted',
        availability: 'reserved',
        addedDate: new Date('2025-09-05'),
      },
    ];

    const mockCategories: LibraryCategory[] = [
      { name: 'Computer Science', icon: Database, count: 245, color: 'text-blue-600' },
      { name: 'Web Development', icon: Globe, count: 189, color: 'text-green-600' },
      { name: 'Database', icon: Archive, count: 156, color: 'text-purple-600' },
      { name: 'Artificial Intelligence', icon: TrendingUp, count: 134, color: 'text-orange-600' },
      { name: 'Academic Skills', icon: BookOpen, count: 98, color: 'text-red-600' },
      { name: 'Graphics', icon: Image, count: 76, color: 'text-indigo-600' },
    ];

    const mockStatistics: LibraryStatistics = {
      totalResources: mockResources.length,
      borrowedResources: mockResources.filter(r => r.availability === 'borrowed').length,
      reservedResources: mockResources.filter(r => r.availability === 'reserved').length,
      bookmarkedResources: mockResources.filter(r => r.isBookmarked).length,
      downloadedResources: 23,
      favoriteCategories: ['Computer Science', 'Web Development'],
      recentActivity: [
        { type: 'borrowed', resourceTitle: 'Database Systems: The Complete Book', date: new Date('2025-10-05') },
        { type: 'downloaded', resourceTitle: 'Machine Learning Fundamentals', date: new Date('2025-10-04') },
        { type: 'bookmarked', resourceTitle: 'Introduction to Algorithms', date: new Date('2025-10-03') },
        { type: 'viewed', resourceTitle: 'Web Development Complete Course', date: new Date('2025-10-02') },
      ],
      readingStreak: 7,
      totalReadingTime: 124,
    };

    setResources(mockResources);
    setCategories(mockCategories);
    setStatistics(mockStatistics);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Unable to load library information</p>
      </div>
    );
  }

  const getTypeIcon = (type: LibraryResource['type']) => {
    const icons = {
      book: BookOpen,
      ebook: BookOpen,
      journal: FileText,
      video: Video,
      audio: Headphones,
      document: FileText,
      dataset: Database,
      website: Globe,
    };
    return icons[type];
  };

  const getTypeColor = (type: LibraryResource['type']) => {
    const colors = {
      book: 'text-blue-600',
      ebook: 'text-indigo-600',
      journal: 'text-green-600',
      video: 'text-red-600',
      audio: 'text-purple-600',
      document: 'text-orange-600',
      dataset: 'text-cyan-600',
      website: 'text-pink-600',
    };
    return colors[type];
  };

  const getAccessColor = (access: LibraryResource['accessLevel']) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      premium: 'bg-yellow-100 text-yellow-800',
      restricted: 'bg-red-100 text-red-800',
    };
    return colors[access];
  };

  const getAvailabilityColor = (availability: LibraryResource['availability']) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      borrowed: 'bg-orange-100 text-orange-800',
      reserved: 'bg-red-100 text-red-800',
    };
    return colors[availability];
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesAccess = selectedAccess === 'all' || resource.accessLevel === selectedAccess;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesType && matchesAccess && matchesSearch;
  });

  const myLibraryResources = resources.filter(r => r.isBookmarked || r.availability === 'borrowed');
  const trendingResources = resources.sort((a, b) => b.views - a.views).slice(0, 5);
  const recommendedResources = resources.filter(r => r.rating >= 4.5).slice(0, 5);

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Digital Library</h1>
          <p className="text-muted-foreground">
            Access thousands of learning resources and materials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            My Bookmarks
          </Button>
        </div>
      </div>

      {/* Library Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalResources}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.borrowedResources}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.reservedResources} reserved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.readingStreak} days</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalReadingTime}h total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.bookmarkedResources}</div>
            <p className="text-xs text-muted-foreground">
              Saved for later
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'browse' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('browse')}
            >
              Browse
            </Button>
            <Button
              variant={viewMode === 'myLibrary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('myLibrary')}
            >
              My Library
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-card text-foreground text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 border border-border rounded-md bg-card text-foreground text-sm"
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="ebook">E-Books</option>
            <option value="journal">Journals</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
            <option value="dataset">Datasets</option>
            <option value="website">Websites</option>
          </select>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Categories Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                Browse by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button type="button"
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Icon className={`h-8 w-8 ${category.color}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-xs text-muted-foreground">{category.count} items</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingResources.map((resource) => {
                    const Icon = getTypeIcon(resource.type);
                    return (
                      <div key={resource.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} bg-opacity-10`}>
                          <Icon className={`h-4 w-4 ${getTypeColor(resource.type)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{resource.title}</h4>
                          <p className="text-xs text-muted-foreground">{resource.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs">{resource.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span className="text-xs">{resource.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statistics.recentActivity.map((activity) => (
                    <div key={`${activity.type}-${activity.resourceTitle}-${activity.date.getTime()}`} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 rounded-lg bg-blue-50">
                        {activity.type === 'borrowed' && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'downloaded' && <Download className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'bookmarked' && <Bookmark className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'viewed' && <Eye className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.resourceTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.type} • {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedResources.map((resource) => {
                  const Icon = getTypeIcon(resource.type);
                  return (
                    <div key={resource.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} bg-opacity-10`}>
                          <Icon className={`h-5 w-5 ${getTypeColor(resource.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{resource.title}</h3>
                            <Badge className={getAccessColor(resource.accessLevel)} variant="outline">
                              {resource.accessLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{resource.author}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs">{resource.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span className="text-xs">{resource.downloads.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {resource.isBookmarked && (
                            <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
                          )}
                          {resource.isLiked && (
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Get
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'browse' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Browse Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => {
                const Icon = getTypeIcon(resource.type);
                return (
                  <div key={resource.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} bg-opacity-10`}>
                        <Icon className={`h-5 w-5 ${getTypeColor(resource.type)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{resource.title}</h3>
                          <Badge className={getAccessColor(resource.accessLevel)} variant="outline">
                            {resource.accessLevel}
                          </Badge>
                          <Badge className={getAvailabilityColor(resource.availability)} variant="outline">
                            {resource.availability}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{resource.description}</p>
                        <p className="text-xs text-muted-foreground">{resource.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs">{resource.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span className="text-xs">{resource.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span className="text-xs">{resource.downloads.toLocaleString()}</span>
                          </div>
                        </div>
                        {resource.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {resource.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {resource.isBookmarked && (
                          <Bookmark className="h-4 w-4 text-blue-600 fill-blue-600" />
                        )}
                        {resource.isLiked && (
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Get
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'myLibrary' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              My Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myLibraryResources.map((resource) => {
                const Icon = getTypeIcon(resource.type);
                return (
                  <div key={resource.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)} bg-opacity-10`}>
                          <Icon className={`h-5 w-5 ${getTypeColor(resource.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <Badge className={getAvailabilityColor(resource.availability)}>
                              {resource.availability}
                            </Badge>
                            {resource.dueDate && (
                              <Badge variant="outline">
                                Due: {resource.dueDate.toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2">{resource.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Author:</span>
                              <p className="font-medium">{resource.author}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <p className="font-medium">{resource.type}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Added:</span>
                              <p className="font-medium">{resource.addedDate.toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Accessed:</span>
                              <p className="font-medium">
                                {resource.lastAccessed?.toLocaleDateString() || 'Never'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {resource.downloadUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4 mr-1" />
                          {resource.isBookmarked ? 'Remove' : 'Bookmark'}
                        </Button>
                        {resource.availability === 'borrowed' && (
                          <Button variant="outline" size="sm">
                            Return
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}