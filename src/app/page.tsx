import Link from "next/link";
import { BarChart, Bot, CheckCircle, Clock, PieChart, Users, Zap, ArrowRight, Star, Sparkles, TrendingUp, Github, Linkedin } from 'lucide-react';

export default async function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-800 font-sans min-h-screen">
      {/* Hero Section */}
      <header className="relative text-center py-32 sm:py-48 overflow-hidden">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_40%,rgba(168,85,247,0.1),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_60%,rgba(59,130,246,0.08),rgba(255,255,255,0))]"></div>
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 z-10">
          <div className="mb-6 inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-200/50 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
            New: Real-Time Emotion AI
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight [text-wrap:balance] mb-8">
            See the Emotion Behind Every Word
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto [text-wrap:balance] leading-relaxed font-light">
            Go beyond sentiment analysis. Our AI pinpoints specific emotions to help you coach agents, reduce churn, and boost CSAT with unprecedented precision.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/analytics"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-indigo-500/25 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <Zap className="mr-3 h-6 w-6 relative z-10" />
              <span className="relative z-10 text-lg">Try Emotion Insights</span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-16 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 left-20 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
      </header>

      <main>
        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard number="90%+" label="Accuracy Rate" />
              <StatCard number="50ms" label="Response Time" />
              <StatCard number="12+" label="Emotion Types" />
              <StatCard number="24/7" label="Monitoring" />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="max-w-5xl mx-auto px-4 text-center py-24 sm:py-32">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12 border border-red-100/50 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-8 text-white">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Stop Guessing, Start Knowing
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Managers fly blind without real-time sentiment data. This leads to missed coaching opportunities, agent burnout, and customer churn that could have been prevented.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 rounded-full mb-6">
                <Star className="w-4 h-4 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Effortless Control, Maximum Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transform your customer interactions with AI-powered insights that drive real results.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard 
                icon={<Bot className="h-12 w-12 text-indigo-600" />} 
                title="Emotion Classifier" 
                description="Instantly identify emotions like frustration, confusion, and satisfaction with 90%+ accuracy using advanced NLP models."
                gradient="from-indigo-500 to-purple-600"
              />
              <FeatureCard 
                icon={<BarChart className="h-12 w-12 text-emerald-600" />} 
                title="Live Transcript View" 
                description="Follow conversations as they happen and receive intelligent alerts on chats that need immediate attention."
                gradient="from-emerald-500 to-teal-600"
              />
              <FeatureCard 
                icon={<PieChart className="h-12 w-12 text-rose-600" />} 
                title="Dashboard & Tips" 
                description="Get a bird's-eye view of team performance and receive AI-powered coaching suggestions in real-time."
                gradient="from-rose-500 to-pink-600"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 sm:py-32 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),rgba(255,255,255,0))]"></div>
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Drive Real-World Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See immediate improvements in team performance and customer satisfaction.
              </p>
            </div>
            <div className="grid gap-8 md:gap-12">
              <BenefitItem 
                icon={<Clock className="h-8 w-8 text-emerald-600"/>} 
                title="Slash review time by 75%" 
                description="Focus on the interactions that matter most with intelligent filtering and prioritization."
                stat="75%"
              />
              <BenefitItem 
                icon={<Users className="h-8 w-8 text-emerald-600"/>} 
                title="Improve agent engagement by 60%" 
                description="Provide targeted, data-driven coaching that agents actually appreciate and use."
                stat="60%"
              />
              <BenefitItem 
                icon={<CheckCircle className="h-8 w-8 text-emerald-600"/>} 
                title="Achieve 40% lift in CSAT" 
                description="Proactively address customer friction before it impacts satisfaction scores."
                stat="40%"
              />
            </div>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 shadow-2xl border border-slate-200/50 relative overflow-hidden">
              <div className="absolute top-6 left-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-2xl sm:text-3xl font-light text-gray-800 leading-relaxed mt-8">
                <p>"This has been a game-changer for our team's morale and effectiveness. We can now pinpoint coaching moments in seconds instead of hours."</p>
              </blockquote>
              <footer className="mt-8 flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Jane Doe</div>
                  <div className="text-gray-600">Head of Support at Acme Inc.</div>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center py-24 px-4 sm:py-32 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Ready to Elevate Your Support Team?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of your customer interactions today. Join thousands of teams already using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/analytics"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-blue-500/25 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10 text-lg">Start Your Free Trial</span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="text-blue-100 hover:text-white font-semibold text-lg transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
        <div className="border-t border-white/10 mt-20 pt-10 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-y-4">
                    <p className="text-sm text-gray-400">
                        Released under the MIT License.
                    </p>
                    <div className="flex items-center space-x-6">
                        <Link href="https://github.com/copydataai" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </Link>
                        <Link href="https://www.linkedin.com/in/copydataai" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

// Enhanced helper components with modern design
const FeatureCard = ({ icon, title, description, gradient }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  gradient: string
}) => (
  <div className="group relative text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className={`inline-block p-4 bg-gradient-to-br ${gradient} rounded-2xl mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const BenefitItem = ({ icon, title, description, stat }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  stat: string
}) => (
  <div className="flex items-center p-8 bg-white rounded-3xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
    <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mr-8 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="flex-grow">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
    <div className="text-right ml-6">
      <div className="text-4xl font-black text-emerald-600">+{stat}</div>
      <div className="text-sm text-gray-500 font-medium">Improvement</div>
    </div>
  </div>
);

const StatCard = ({ number, label }: { number: string, label: string }) => (
  <div className="group p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-200">
    <div className="text-3xl sm:text-4xl font-black text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);
