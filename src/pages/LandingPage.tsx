import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Image, Upload, Wand2, Share2, CheckCircle2, ArrowRight, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans selection:bg-indigo-500/30">

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              Propel
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-full transition-all hover:bg-slate-100 active:scale-95"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8"
            >
              Sell properties <br className="hidden md:block" />
              <span className="text-indigo-400">
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
              className="flex flex-col items-center justify-center gap-6 mt-4"
            >
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)]"
              >
                Start your 14-day free trial <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                 <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-slate-800/50
                        ${i===1 ? 'bg-blue-600' : i===2 ? 'bg-purple-600' : i===3 ? 'bg-emerald-600' : 'bg-rose-600'}
                      `}>
                        {['JD', 'AS', 'MR', 'KL'][i-1]}
                      </div>
                    ))}
                 </div>
                 <div className="flex flex-col items-center sm:items-start gap-1">
                   <div className="flex gap-1 text-amber-400">
                     {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                   </div>
                   <span className="text-white/60 text-sm">Trusted by <strong>2,500+</strong> top agents</span>
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-white/50 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
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

        {/* How it Works Section */}
        <section className="py-24 md:py-32 bg-slate-900 border-y border-white/5 relative overflow-hidden" ref={containerRef}>
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-slate-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20 md:mb-32">

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                3 steps to your next sold listing
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto"
              >
                Stop wasting hours editing photos and struggling to write descriptions. Let Propel do the heavy lifting so you can focus on what you do best: closing deals.
              </motion.p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Central Line for Desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
              <motion.div 
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-indigo-500 -translate-x-1/2 rounded-full origin-top"
                style={{ scaleY: lineHeight }}
              />

              {/* Steps */}
              <div className="space-y-24 md:space-y-40">
                {[
                  {
                    icon: <Upload className="w-8 h-8 text-indigo-400" />,
                    title: "1. Drop in your photos",
                    description: "Just snapped some photos on your phone? Drop them right in. Don't worry about lighting, angles, or sorting—we'll take care of all of that for you.",
                    features: ["No editing skills needed", "Works with any phone camera", "Instant upload"],
                    imageContent: (
                      <div className="w-full h-full bg-slate-800 rounded-3xl border border-white/5 p-6 flex flex-col justify-center gap-4 relative overflow-hidden group shadow-xl">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500" />
                        <div className="border border-dashed border-indigo-500/20 rounded-2xl flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 group-hover:border-indigo-500/40 transition-colors duration-500">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6"
                          >
                            <Upload className="w-10 h-10 text-indigo-400" />
                          </motion.div>
                          <span className="text-white font-semibold text-lg mb-2">Drag & Drop Photos</span>
                          <span className="text-white/40 text-sm">Upload up to 50 photos at once</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    icon: <Wand2 className="w-8 h-8 text-indigo-400" />,
                    title: "2. We make them look amazing",
                    description: "In seconds, your dark, blurry photos become bright, magazine-quality shots. Plus, we'll write a catchy, professional property description that makes buyers want to visit.",
                    features: ["Magazine-quality photos", "Descriptions that sell", "Done in seconds"],
                    imageContent: (
                      <div className="w-full h-full bg-slate-800 rounded-3xl border border-white/5 p-6 flex flex-col gap-6 relative overflow-hidden group shadow-xl">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500" />
                        <div className="flex gap-4">
                           <div className="flex-1 h-36 md:h-48 rounded-2xl bg-slate-700 relative overflow-hidden border border-white/5">
                             <div className="absolute inset-0 bg-black/40" />
                             <span className="absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 bg-black/80 text-white/70 rounded-md uppercase tracking-wider">Before</span>
                           </div>
                           <div className="flex-1 h-36 md:h-48 rounded-2xl bg-indigo-900/30 relative overflow-hidden border border-indigo-500/20">
                              <div className="absolute inset-0 bg-indigo-500/10" />
                              <span className="absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 bg-indigo-500 text-white rounded-md uppercase tracking-wider shadow-lg">After</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-3 mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-indigo-500 animate-pulse" />
                            <div className="h-3 bg-white/10 rounded-full w-3/4" />
                          </div>
                          <div className="h-3 bg-white/5 rounded-full w-full ml-7" />
                          <div className="h-3 bg-white/5 rounded-full w-5/6 ml-7" />
                        </div>
                      </div>
                    )
                  },
                  {
                    icon: <Share2 className="w-8 h-8 text-indigo-400" />,
                    title: "3. Share and get leads",
                    description: "You're ready for the MLS. Best of all, with one click, get custom Instagram posts, Facebook reels, and LinkedIn updates ready to post and attract potential buyers.",
                    features: ["Ready for MLS & Zillow", "Done-for-you social posts", "Grow your audience"],
                    imageContent: (
                       <div className="w-full h-full bg-slate-800 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col justify-center gap-4 relative overflow-hidden group shadow-xl">
                          <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500" />
                          
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex gap-4 items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-900 border border-white/5 shadow-md cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Share2 className="w-6 h-6 text-indigo-400" />
                              </div>
                              <span className="text-white font-medium">Facebook Update</span>
                            </div>
                            <span className="text-green-400 text-xs font-bold uppercase tracking-widest bg-green-400/10 px-3 py-1.5 rounded-md">Ready</span>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex gap-4 items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-900 border border-white/5 shadow-md cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Image className="w-6 h-6 text-indigo-400" />
                              </div>
                              <span className="text-white font-medium">Instagram Post</span>
                            </div>
                            <span className="text-green-400 text-xs font-bold uppercase tracking-widest bg-green-400/10 px-3 py-1.5 rounded-md">Ready</span>
                          </motion.div>

                          <button className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg hover:-translate-y-0.5 transition-all mt-4">
                            Publish to all channels
                          </button>
                       </div>
                    )
                  }
                ].map((step, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div key={i} className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                      {/* Timeline Node for Desktop */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900 border-[3px] border-indigo-500/30 items-center justify-center z-20 shadow-lg"
                      >
                        {step.icon}
                      </motion.div>

                      {/* Content */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className={`flex-1 w-full md:w-1/2 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} text-center md:text-left`}
                      >
                         {/* Mobile Icon */}
                         <div className="md:hidden flex items-center justify-center mx-auto mb-8 w-20 h-20 rounded-full bg-slate-800 border border-white/5 shadow-xl">
                            {step.icon}
                         </div>

                        <h3 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${isEven ? 'md:ml-auto' : ''}`}>{step.title}</h3>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
                          {step.description}
                        </p>
                        <ul className={`flex flex-col gap-4 ${isEven ? 'md:items-end' : 'md:items-start'} items-center`}>
                          {step.features.map((feature, idx) => (
                            <li key={idx} className={`flex items-center gap-3 text-white/80 flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>
                              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                              <span className="text-base font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Image/Mockup */}
                      <motion.div 
                         initial={{ opacity: 0, scale: 0.95, y: 20 }}
                         whileInView={{ opacity: 1, scale: 1, y: 0 }}
                         viewport={{ once: true, margin: "-100px" }}
                         transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 w-full md:w-1/2 aspect-[4/3] md:aspect-square lg:aspect-[4/3]"
                      >
                        {step.imageContent}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-800/30" />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-10 md:p-20 shadow-2xl backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to win more listings?
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Stop letting average photos and boring descriptions cost you commissions.
              Join thousands of top-producing agents who use Propel to scale.
            </p>
            <div className="flex flex-col items-center justify-center gap-6">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-3"
              >
                Start your free trial <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-white/50">
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                   <span>14-day free trial</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                   <span>No credit card</span>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
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
