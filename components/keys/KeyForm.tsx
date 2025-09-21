"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { CreateKeySchema } from '@/lib/validations';
import { 
  Loader2, Key, Tag, Folder, FileText, Eye, EyeOff, AlertCircle, Calendar,
  Shield, Zap, Clock, Info, CheckCircle2, Lock, Server, Globe, Database, Webhook, Users, Settings
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collection } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface KeyFormProps {
  onSubmit: SubmitHandler<z.infer<typeof CreateKeySchema>>;
  isSubmitting: boolean;
  collections?: Collection[];
  initialData?: Partial<z.infer<typeof CreateKeySchema>> & { id?: string };
  formError?: string | null;
  onCancel?: () => void;
}

const KEY_TYPES = [
  { value: 'api_key', label: 'API Key', description: 'REST API keys and access tokens', icon: Globe, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'database', label: 'Database', description: 'Database connection strings and credentials', icon: Database, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'oauth', label: 'OAuth', description: 'OAuth tokens and authentication secrets', icon: Users, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'webhook', label: 'Webhook', description: 'Webhook signing secrets and endpoints', icon: Webhook, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'certificate', label: 'Certificate', description: 'SSL certificates and private keys', icon: Shield, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'token', label: 'Access Token', description: 'Generic access tokens and bearer tokens', icon: Key, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { value: 'password', label: 'Password', description: 'Passwords and passphrases', icon: Lock, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  { value: 'other', label: 'Other', description: 'Other sensitive information', icon: Settings, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
];

export function KeyForm({
  onSubmit,
  isSubmitting,
  collections = [],
  initialData,
  formError,
  onCancel = () => {},
}: KeyFormProps) {
  const [showValue, setShowValue] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const getDefaultCollectionId = () => {
    if (initialData?.collectionId) return initialData.collectionId;
    if (collections.length > 0 && collections[0]?.id) return collections[0].id;
    return undefined;
  };

  const form = useForm<z.infer<typeof CreateKeySchema>>({
    
    resolver: zodResolver(CreateKeySchema),
    defaultValues: {
      name: initialData?.name || '',
      value: '',
      collectionId: getDefaultCollectionId(),
      key_type: initialData?.key_type || 'api_key',
      description: initialData?.description || '',
      expiresAt: initialData?.expiresAt 
        ? new Date(initialData.expiresAt) 
        : undefined,
    },
  });

  const selectedType = form.watch('key_type');
  const keyTypeInfo = KEY_TYPES.find((type) => type.value === selectedType);
  const watchedName = form.watch('name');

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Key details and type' },
    { id: 2, name: 'Organization', description: 'Collection and settings' },
    { id: 3, name: 'Secret Value', description: 'Secure key storage' },
  ];

  const handleFormSubmit: SubmitHandler<z.infer<typeof CreateKeySchema>> = (values) => onSubmit(values);

  return (
    <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-600">
      <div className="space-y-6 p-1">
        {formError && (
          <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800 dark:text-red-200">{formError}</AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{step.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Step 1: Basic Info */}
            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-blue-800 dark:text-blue-200">
                  <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3>Basic Information</h3>
                    <p className="text-sm font-normal text-blue-600 dark:text-blue-300 mt-1">Define the key name and type</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Key Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center text-slate-900 dark:text-slate-100">
                        <Tag className="w-4 h-4 mr-2" />
                        Key Name *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., GitHub API Token" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200" />
                      </FormControl>
                      <FormDescription className="flex items-center text-slate-600 dark:text-slate-400">
                        <Info className="w-3 h-3 mr-1" />
                        Choose a descriptive name to easily identify this key
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Key Type */}
                <FormField
                  control={form.control}
                  name="key_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center text-slate-900 dark:text-slate-100">
                        <Zap className="w-4 h-4 mr-2" />
                        Key Type *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                            <SelectValue placeholder="Select the type of key" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto">
                          {KEY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="py-3 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {keyTypeInfo && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className={keyTypeInfo.color}>
                            {React.createElement(keyTypeInfo.icon, { className: "w-3 h-3 mr-1" })}
                            {keyTypeInfo.label}
                          </Badge>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{keyTypeInfo.description}</span>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center text-slate-900 dark:text-slate-100">
                        <FileText className="w-4 h-4 mr-2" />
                        Description (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the purpose of this key..." className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 min-h-[100px] resize-none transition-all duration-200" />
                      </FormControl>
                      <FormDescription className="flex items-center text-slate-600 dark:text-slate-400">
                        <Info className="w-3 h-3 mr-1" />
                        Help team members understand what this key is used for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Step 2: Organization & Configuration */}
            <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-purple-800 dark:text-purple-200">
                  <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3>Organization & Settings</h3>
                    <p className="text-sm font-normal text-purple-600 dark:text-purple-300 mt-1">
                      Collection assignment and expiration settings
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Collection Selection */}
                {collections && collections.length > 0 && (
  <FormField
    control={form.control}
    name="collectionId"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-semibold flex items-center text-slate-900 dark:text-slate-100">
          <Folder className="w-4 h-4 mr-2" />
          Collection (Optional)
        </FormLabel>
        <Select 
          onValueChange={(value) => {
            // Handle standalone option properly
            field.onChange(value === "standalone" ? undefined : value);
          }} 
          value={field.value || "standalone"}
        >
          <FormControl>
            <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20">
              <SelectValue placeholder="Choose a collection or leave standalone" />
            </SelectTrigger>
          </FormControl>
          <SelectContent 
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 z-[9999] shadow-lg" 
            position="popper"
            sideOffset={4}
          >
            {/* Standalone Option */}
            <SelectItem 
              key="standalone-key-option" 
              value="standalone"
              className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              <div className="flex items-center">
                <Key className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                <span className="text-slate-500 dark:text-slate-400">Standalone Key (No Collection)</span>
              </div>
            </SelectItem>
            
            {/* Collection Options */}
            {collections
              .filter(collection => collection?.id && collection?.name) // More specific filtering
              .map((collection) => (
                <SelectItem 
                  key={collection.id} 
                  value={collection.id} 
                  className="text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <div className="flex items-center">
                    <Folder className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                    <span>{collection.name}</span>
                  </div>
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <FormDescription className="flex items-center text-slate-600 dark:text-slate-400">
          <Info className="w-3 h-3 mr-1" />
          Group related keys together or keep this key independent
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
)}

                <Separator className="my-4 bg-slate-200 dark:bg-slate-700" />

                {/* Expiration Date */}
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center text-slate-900 dark:text-slate-100">
                        <Clock className="w-4 h-4 mr-2" />
                        Expiration Date (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200" 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center text-slate-600 dark:text-slate-400">
                        <Info className="w-3 h-3 mr-1" />
                        Set when this key expires. It will be marked as expired after this date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Step 3: Secret Value */}
            <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center text-amber-800 dark:text-amber-200">
                  <div className="w-10 h-10 bg-amber-600 dark:bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3>Secret Value</h3>
                    <p className="text-sm font-normal text-amber-600 dark:text-amber-300 mt-1">
                      The actual secret that will be encrypted and stored
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>Security Notice:</strong> This value will be encrypted using AES-256 encryption and stored securely. Only you will be able to decrypt and view it.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center text-slate-900 dark:text-slate-100">
                        <Lock className="w-4 h-4 mr-2" />
                        Secret Key Value *
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="Paste or type your secret key value here..."
                            className="bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 min-h-[120px] font-mono text-sm pr-12 transition-all duration-200" 
                            style={{ 
                              filter: showValue ? 'none' : 'blur(4px)',
                              transition: 'filter 0.2s ease-in-out'
                            }}
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          onClick={() => setShowValue(!showValue)}
                        >
                          {showValue ? (
                            <EyeOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          )}
                        </Button>
                      </div>
                      <FormDescription className="flex items-center text-amber-700 dark:text-amber-300">
                        <Shield className="w-3 h-3 mr-1" />
                        {showValue 
                          ? "Value is visible. Click the eye icon to hide it again."
                          : "Value is hidden for security. Click the eye icon to view while typing."
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preview Card */}
            {watchedName && (
              <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-green-800 dark:text-green-200">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-700">
                    {keyTypeInfo && (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${keyTypeInfo.color}`}>
                        {React.createElement(keyTypeInfo.icon, { className: "w-5 h-5" })}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">{watchedName}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {keyTypeInfo?.label} • {form.watch('description') || 'No description'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Shield className="w-3 h-3 mr-1" />
                      Encrypted
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 -mx-1">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                {onCancel && (
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={onCancel} 
                                      disabled={isSubmitting}
                                      className="w-full sm:w-auto border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                      Cancel
                                    </Button>
                                  )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {initialData ? 'Updating Key...' : 'Creating Key...'}
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      {initialData ? 'Update Key' : 'Create Key'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}