import React, { useState } from 'react';
import { Collection, Key } from '@/types/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  FolderKanban,
  Key as KeyIcon,
  MoreVertical,
  Calendar,
  Users,
  Lock,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Settings,
  Archive,
  Star,
  Clock,
  Activity,
  Shield,
  Database,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface CollectionCardProps {
  collection: Collection & {
    keyCount: number;
    recentKeys: Key[];
    totalSize: number;
    lastActivity: Date | null;
  };
  onEdit?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
  onDuplicate?: (collection: Collection) => void;
  onArchive?: (collection: Collection) => void;
  viewMode?: 'grid' | 'list';
}

const KEY_TYPE_ICONS = {
  api_key: Globe,
  secret: Lock,
  token: KeyIcon,
  credential: Users,
} as const;

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  viewMode = 'grid',
}) => {
  const [showRecentKeys, setShowRecentKeys] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateValue: Date | null) => {
    if (!dateValue) return 'Never';
    const date = new Date(dateValue);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleCopyId = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(collection.id);
      toast({
        title: 'Copied to clipboard',
        description: 'Collection ID has been copied.',
        duration: 3000,
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const getCollectionIcon = () => {
    switch (collection.icon) {
      case 'lock':
        return Lock;
      case 'server':
        return Database;
      case 'globe':
        return Globe;
      case 'database':
        return Database;
      case 'cloud':
        return Shield;
      case 'shield':
        return Shield;
      case 'users':
        return Users;
      case 'settings':
        return Settings;
      default:
        return FolderKanban;
    }
  };

  const IconComponent = getCollectionIcon();

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate">
                      {collection.name}
                    </h3>
                  </Link>
                  {collection.is_archived && (
                    <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400">
                      <Archive className="w-3 h-3 mr-1" />
                      Archived
                    </Badge>
                  )}
                </div>
                {collection.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <KeyIcon className="w-3 h-3 mr-1" />
                    {collection.keyCount} keys
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(collection.lastActivity)}
                  </span>
                  <span className="flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    {formatSize(collection.totalSize)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <Link href={`/collections/${collection.id}`}>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/collections/${collection.id}`} className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Link>
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(collection)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(collection)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleCopyId}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy ID
                  </DropdownMenuItem>
                  {onArchive && (
                    <DropdownMenuItem onClick={() => onArchive(collection)}>
                      <Archive className="w-4 h-4 mr-2" />
                      {collection.is_archived ? 'Restore' : 'Archive'}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(collection.id)}
                      className="text-red-600 focus:text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Link href={`/collections/${collection.id}`} className="block min-w-0">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {collection.name}
                  </h3>
                </Link>
                {collection.is_archived && (
                  <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400 shrink-0">
                    <Archive className="w-3 h-3 mr-1" />
                    Archived
                  </Badge>
                )}
              </div>
              {collection.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8 p-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/collections/${collection.id}`} className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Link>
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(collection)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(collection)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleCopyId}>
                <Copy className="w-4 h-4 mr-2" />
                Copy ID
              </DropdownMenuItem>
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(collection)}>
                  <Archive className="w-4 h-4 mr-2" />
                  {collection.is_archived ? 'Restore' : 'Archive'}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(collection.id)}
                  className="text-red-600 focus:text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 transition-colors">
              <div className="flex items-center space-x-2">
                <KeyIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {collection.keyCount}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Keys</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 transition-colors">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Updated</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {formatDate(collection.lastActivity)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Keys */}
          {collection.recentKeys && collection.recentKeys.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Recent Keys</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentKeys(!showRecentKeys)}
                  className="h-6 px-2 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  {showRecentKeys ? 'Hide' : 'Show'}
                </Button>
              </div>

              {showRecentKeys && (
                <div className="space-y-1">
                  {collection.recentKeys.slice(0, 3).map((key) => {
                    const KeyTypeIcon = KEY_TYPE_ICONS[key.key_type as keyof typeof KEY_TYPE_ICONS] || KeyIcon;
                    return (
                      <div
                        key={key.id}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <KeyTypeIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{key.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {key.is_favorite && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                          {key.expires_at && new Date(key.expires_at) < new Date() && (
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {collection.keyCount > 3 && (
                    <div className="text-center py-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        +{collection.keyCount - 3} more keys
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <Link href={`/collections/${collection.id}`} className="block">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm text-emerald-600 dark:text-emerald-400"
              >
                Open Collection
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;