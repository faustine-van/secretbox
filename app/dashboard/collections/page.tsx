import { CollectionManager } from '@/components/collections/CollectionManager';
import { Card, CardContent } from '@/components/ui/card';
import { FolderKanban, Shield, Users, Zap } from 'lucide-react';

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-emerald-950/30 dark:to-teal-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderKanban className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 dark:from-slate-200 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
            Collections Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Organize your secrets into logical groups for better management and team collaboration
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Organized</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">5</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Collections</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Team Access</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">8</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Members</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick Access</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">2s</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Avg Response</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <CollectionManager />
      </div>
    </div>
  );
}