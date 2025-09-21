import React from 'react';
import { Collection } from '@/types/supabase';
import { 
  FolderKanban, 
  Key, 
  MoreVertical, 
  Calendar,
  Users,
  Lock,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Settings
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface CollectionCardProps {
  collection: Collection;
  keyCount?: number;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
  onDuplicate?: (collection: Collection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ 
  collection, 
  keyCount = 0,
  onEdit,
  onDelete,
  onDuplicate 
}) => {
  const formatDate = (date: string) => {
    const now = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const IconComponent = FolderKanban;

  const handleCopyId = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(collection.id);
    // You might want to show a toast here
  };

  return (
    <Card className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-900/90 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-600/20 dark:via-teal-600/20 dark:to-cyan-600/20 p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 shadow-lg`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/collections/${collection.id}`} className="block">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {collection.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {collection.description || 'No description provided'}
                </p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                <DropdownMenuItem asChild>
                  <Link href={`/collections/${collection.id}`} className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Collection
                  </Link>
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(collection)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Details
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
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(collection.id)}
                    className="text-red-600 focus:text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Collection
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Key className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{keyCount}</p>
                <p className="text-slate-600 dark:text-slate-400">Keys</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Created</p>
                <p className="text-slate-600 dark:text-slate-400">{formatDate(collection.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Tags/Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
            </div>
            
            <Link href={`/collections/${collection.id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress bar for visual enhancement */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </CardContent>
    </Card>
  );
};