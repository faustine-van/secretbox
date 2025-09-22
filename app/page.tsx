"use client";
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Users, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Zap,
  Eye,
  Database,
  Cloud,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from "next-themes";


const HomePage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption with zero-knowledge architecture ensures your secrets remain truly secret.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Key,
      title: 'Smart Key Management',
      description: 'Intelligent rotation, expiration tracking, and automated compliance for all your API keys and certificates.',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Granular permissions and audit trails enable secure sharing across your entire organization.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Zap,
      title: 'Developer Experience',
      description: 'CLI tools, SDKs, and integrations that fit seamlessly into your existing development workflow.',
      color: 'from-pink-500 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO at TechCorp',
      avatar: 'SC',
      content: 'SecretBox transformed our security posture. The audit trails and automated rotation saved us countless hours.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'DevOps Lead',
      avatar: 'MR',
      content: 'Finally, a secrets manager that developers actually want to use. The CLI integration is phenomenal.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Security Engineer',
      avatar: 'EW',
      content: 'The compliance features and detailed logging make audits a breeze. Highly recommended.',
      rating: 5
    }
  ];

  const stats = [
    { value: '10M+', label: 'Secrets Managed' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '500+', label: 'Enterprise Clients' },
    { value: '24/7', label: 'Expert Support' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                SecretBox
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Docs
              </a>
              <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              > 
                {theme === 'light' ? (
                  <div className="w-5 h-5 bg-slate-800 rounded-full" suppressHydrationWarning></div>
                ) : (
                  <div className="w-5 h-5 bg-yellow-400 rounded-full" suppressHydrationWarning></div>
                )}
              </button>
              <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing
                </a>
                <a href="#docs" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Docs
                </a>
                <Link href="/login" className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm text-left">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Secure Your Secrets,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Empower Your Team
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
              Enterprise-grade secrets management that developers love. Secure API keys, certificates, 
              and sensitive data with military-grade encryption and zero-knowledge architecture.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                View Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="relative">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg h-6 flex items-center px-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">app.secretbox.com/dashboard</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg"></div>
                    <div>
                      <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg"></div>
                    <div>
                      <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg"></div>
                    <div>
                      <div className="w-28 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="w-18 h-6 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Everything you need to manage secrets securely across your entire organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              See what security professionals are saying about SecretBox
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-6"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Secrets?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of teams who trust SecretBox with their most sensitive data
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 border border-blue-300 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  SecretBox
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Enterprise-grade secrets management for modern development teams.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Connect</h3>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <Github className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <Twitter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <Linkedin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 SecretBox. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;