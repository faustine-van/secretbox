
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/lib/theme';

const ProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
});

export function ProfileSettings() {
  const { theme, setTheme } = useTheme();
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold">Profile Settings</h2>
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
      <div className="mt-8">
        <h3 className="text-lg font-bold">Theme</h3>
        <div className="flex space-x-4 mt-4">
          <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
          <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
          <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>System</Button>
        </div>
      </div>
    </div>
  );
}
