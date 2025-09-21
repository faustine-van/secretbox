import { Folder, Shield, Key, Database, Cloud, Server, Globe, Lock, Code, Settings, Archive, Bookmark, Box, Briefcase, Building, Calendar, Camera, Clock, CreditCard, FileText, Flag, Gift, Heart, Home, Layers, Mail, Map, Monitor, Package, Palette, Phone, Puzzle, Rocket, Star, Tag, Target, PenTool as Tool, Trophy, Truck, Users, Zap } from 'lucide-react';

export const COLLECTION_COLORS = [
  { value: 'blue', label: 'Blue', class: 'from-blue-500 to-blue-600' },
  { value: 'indigo', label: 'Indigo', class: 'from-indigo-500 to-indigo-600' },
  { value: 'purple', label: 'Purple', class: 'from-purple-500 to-purple-600' },
  { value: 'pink', label: 'Pink', class: 'from-pink-500 to-pink-600' },
  { value: 'red', label: 'Red', class: 'from-red-500 to-red-600' },
  { value: 'orange', label: 'Orange', class: 'from-orange-500 to-orange-600' },
  { value: 'yellow', label: 'Yellow', class: 'from-yellow-500 to-yellow-600' },
  { value: 'green', label: 'Green', class: 'from-green-500 to-green-600' },
  { value: 'teal', label: 'Teal', class: 'from-teal-500 to-teal-600' },
  { value: 'cyan', label: 'Cyan', class: 'from-cyan-500 to-cyan-600' }
];

export const COLLECTION_ICONS = [
  { value: 'folder', label: 'Folder', component: Folder, keywords: ['directory', 'files'] },
  { value: 'shield', label: 'Shield', component: Shield, keywords: ['security', 'protection'] },
  { value: 'key', label: 'Key', component: Key, keywords: ['access', 'password'] },
  { value: 'database', label: 'Database', component: Database, keywords: ['data', 'storage'] },
  { value: 'cloud', label: 'Cloud', component: Cloud, keywords: ['aws', 'azure', 'gcp'] },
  { value: 'server', label: 'Server', component: Server, keywords: ['infrastructure', 'hosting'] },
  { value: 'globe', label: 'Globe', component: Globe, keywords: ['web', 'internet', 'api'] },
  { value: 'lock', label: 'Lock', component: Lock, keywords: ['secure', 'private'] },
  { value: 'code', label: 'Code', component: Code, keywords: ['development', 'programming'] },
  { value: 'settings', label: 'Settings', component: Settings, keywords: ['configuration', 'options'] },
  { value: 'archive', label: 'Archive', component: Archive, keywords: ['backup', 'storage'] },
  { value: 'bookmark', label: 'Bookmark', component: Bookmark, keywords: ['favorite', 'saved'] },
  { value: 'box', label: 'Box', component: Box, keywords: ['package', 'container'] },
  { value: 'briefcase', label: 'Briefcase', component: Briefcase, keywords: ['business', 'work'] },
  { value: 'building', label: 'Building', component: Building, keywords: ['company', 'office'] },
  { value: 'calendar', label: 'Calendar', component: Calendar, keywords: ['schedule', 'time'] },
  { value: 'camera', label: 'Camera', component: Camera, keywords: ['photo', 'media'] },
  { value: 'clock', label: 'Clock', component: Clock, keywords: ['time', 'schedule'] },
  { value: 'credit-card', label: 'Credit Card', component: CreditCard, keywords: ['payment', 'billing'] },
  { value: 'file-text', label: 'Document', component: FileText, keywords: ['file', 'document'] },
  { value: 'flag', label: 'Flag', component: Flag, keywords: ['marker', 'important'] },
  { value: 'gift', label: 'Gift', component: Gift, keywords: ['present', 'bonus'] },
  { value: 'heart', label: 'Heart', component: Heart, keywords: ['favorite', 'love'] },
  { value: 'home', label: 'Home', component: Home, keywords: ['house', 'main'] },
  { value: 'layers', label: 'Layers', component: Layers, keywords: ['stack', 'multiple'] },
  { value: 'mail', label: 'Mail', component: Mail, keywords: ['email', 'message'] },
  { value: 'map', label: 'Map', component: Map, keywords: ['location', 'navigation'] },
  { value: 'monitor', label: 'Monitor', component: Monitor, keywords: ['screen', 'display'] },
  { value: 'package', label: 'Package', component: Package, keywords: ['delivery', 'box'] },
  { value: 'palette', label: 'Palette', component: Palette, keywords: ['design', 'color'] },
  { value: 'phone', label: 'Phone', component: Phone, keywords: ['call', 'mobile'] },
  { value: 'puzzle', label: 'Puzzle', component: Puzzle, keywords: ['integration', 'piece'] },
  { value: 'rocket', label: 'Rocket', component: Rocket, keywords: ['launch', 'fast'] },
  { value: 'star', label: 'Star', component: Star, keywords: ['favorite', 'rating'] },
  { value: 'tag', label: 'Tag', component: Tag, keywords: ['label', 'category'] },
  { value: 'target', label: 'Target', component: Target, keywords: ['goal', 'aim'] },
  { value: 'tool', label: 'Tool', component: Tool, keywords: ['utility', 'maintenance'] },
  { value: 'trophy', label: 'Trophy', component: Trophy, keywords: ['achievement', 'award'] },
  { value: 'truck', label: 'Truck', component: Truck, keywords: ['delivery', 'transport'] },
  { value: 'users', label: 'Users', component: Users, keywords: ['team', 'people'] },
  { value: 'zap', label: 'Zap', component: Zap, keywords: ['energy', 'power', 'fast'] }
];

export const getCollectionIcon = (iconName: string | null) => {
  const icon = COLLECTION_ICONS.find(i => i.value === iconName);
  return icon?.component || Folder;
};

export const getColorClasses = (colorName: string | null) => {
  const color = COLLECTION_COLORS.find(c => c.value === colorName);
  return color?.class || 'from-blue-500 to-blue-600';
};

export const generateCollectionId = () => {
  return `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateKeyId = () => {
  return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCollectionDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getKeyTypeIcon = (keyType: string) => {
  switch (keyType.toLowerCase()) {
    case 'api_key':
    case 'api-key':
      return Key;
    case 'database':
    case 'db_password':
      return Database;
    case 'certificate':
    case 'ssl_cert':
      return FileText;
    case 'token':
    case 'auth_token':
      return Globe;
    case 'ssh_key':
      return Lock;
    default:
      return Key;
  }
};

export const getKeyStatusColor = (key: any) => {
  if (key.expires_at) {
    const expiresAt = new Date(key.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    } else if (daysUntilExpiry <= 7) {
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    }
  }
  
  return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
};

export const getKeyStatus = (key: any): 'active' | 'expired' | 'expiring' => {
  if (key.expires_at) {
    const expiresAt = new Date(key.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return 'expired';
    } else if (daysUntilExpiry <= 7) {
      return 'expiring';
    }
  }
  
  return 'active';
};