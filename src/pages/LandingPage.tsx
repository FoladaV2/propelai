import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ArrowRight, Home, Image, PenTool, TrendingUp, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Propel
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">{user ? 'Dashboard' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Propel 2.0 is now live</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8"
            >
              Sell properties <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                10x faster with AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 leading-relaxed"
            >
              Transform your ordinary listings into premium marketing assets. 
              Generate hyper-converting copy, stunning images, and social posts in under 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Start your 14-day free trial
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-6 text-sm text-white/40"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mockup Preview Section */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 p-2 md:p-4 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-full h-[300px] md:h-[600px] bg-slate-800 rounded-xl md:rounded-3xl border border-white/5 relative overflow-hidden flex flex-col">
                {/* Mockup Top Bar */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-slate-800/50">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                {/* Mockup Content */}
                <div className="flex-1 p-6 md:p-10 flex gap-6 overflow-hidden">
                  <div className="hidden md:flex flex-col gap-4 w-64">
                    <div className="h-8 bg-white/5 rounded-lg w-full" />
                    <div className="h-4 bg-white/5 rounded-full w-3/4 mt-4" />
                    <div className="h-4 bg-white/5 rounded-full w-1/2" />
                    <div className="h-4 bg-white/5 rounded-full w-2/3" />
                  </div>
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="h-32 md:h-64 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-indigo-400/50">
                         <Image className="w-12 h-12" />
                         <span className="font-medium">AI Magic in progress...</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5" />
                      <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5" />
                      <div className="hidden md:block flex-1 h-24 bg-white/5 rounded-xl border border-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-800/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Your unfair advantage
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Stop wasting hours on descriptions and photo editing. Let Propel do the heavy lifting while you focus on closing deals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Image className="w-6 h-6 text-indigo-400" />,
                  title: "Smart Image Enhancement",
                  description: "Dark, blurry photos? Our AI automatically brightens, straightens, and enhances your raw photos into magazine-quality shots."
                },
                {
                  icon: <PenTool className="w-6 h-6 text-purple-400" />,
                  title: "Copy That Converts",
                  description: "Generate engaging, SEO-optimized property descriptions that highlight unique features and create emotional connection."
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-pink-400" />,
                  title: "Social Media Ready",
                  description: "One click generates customized captions and hashtags for Instagram, LinkedIn, and Facebook, ready to post."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-slate-800/50 border border-white/5 p-8 rounded-3xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to win more listings?
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Join thousands of top-producing agents who are already using Propel to scale their marketing.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
            >
              Get Started for Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Home className="text-white/40 w-5 h-5" />
            <span className="text-lg font-bold text-white/40">Propel</span>
          </div>
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} Propel Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
