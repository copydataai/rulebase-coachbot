import Link from "next/link";
import { BarChart, Bot, CheckCircle, Clock, PieChart, Users, Zap } from 'lucide-react';

export default async function Home() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <header className="relative text-center py-24 sm:py-40 overflow-hidden bg-gray-50">
        {/* Grid background */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(192,132,252,0.2),rgba(255,255,255,0))]"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <div className="mb-4 inline-flex items-center justify-center px-4 py-1 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
            New: Real-Time Emotion AI
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight [text-wrap:balance]">
            See the Emotion Behind Every Word
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto [text-wrap:balance]">
            Go beyond sentiment analysis. Our AI pinpoints specific emotions to help you coach agents, reduce churn, and boost CSAT.
          </p>
          <div className="mt-10">
            <Link
              href="/analytics"
              className="group relative inline-flex items-center justify-center bg-purple-600 text-white font-bold px-8 py-4 rounded-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-purple-700 transform hover:scale-105"
            >
              <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
              <Zap className="mr-2 h-5 w-5" />
              <span className="relative">Try Emotion Insights</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="py-20 sm:py-28">
        {/* Problem Section */}
        <section className="max-w-4xl mx-auto px-4 text-center mb-20 sm:mb-28">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Stop Guessing, Start Knowing</h2>
          <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">
            Managers fly blind without real-time sentiment data. This leads to missed coaching opportunities, agent burnout, and customer churn.
          </p>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Powerful Features, Effortless Control</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard 
                icon={<Bot className="h-10 w-10 text-purple-600" />} 
                title="Emotion Classifier" 
                description="Instantly identify emotions like frustration, confusion, and satisfaction with 90%+ accuracy."
              />
              <FeatureCard 
                icon={<BarChart className="h-10 w-10 text-purple-600" />} 
                title="Live Transcript View" 
                description="Follow conversations as they happen and receive alerts on chats that need immediate attention."
              />
              <FeatureCard 
                icon={<PieChart className="h-10 w-10 text-purple-600" />} 
                title="Dashboard & Tips" 
                description="Get a bird's-eye view of team performance and receive AI-powered coaching suggestions."
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Drive Real-World Results</h2>
            </div>
            <ul className="space-y-8 text-lg">
              <BenefitItem icon={<Clock className="h-7 w-7 text-green-500"/>} title="Slash review time" description="by focusing on the interactions that matter most." />
              <BenefitItem icon={<Users className="h-7 w-7 text-green-500"/>} title="Improve agent engagement" description="with targeted, data-driven coaching." />
              <BenefitItem icon={<CheckCircle className="h-7 w-7 text-green-500"/>} title="Achieve a significant lift in CSAT" description="by proactively addressing customer friction." />
            </ul>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="bg-gray-50 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <blockquote className="text-xl sm:text-2xl font-medium text-gray-700">
              <p>"This has been a game-changer for our team's morale and effectiveness. We can now pinpoint coaching moments in seconds."</p>
              <footer className="mt-6 font-semibold text-gray-900 not-italic">— Jane Doe, Head of Support at Acme Inc.</footer>
            </blockquote>
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Elevate Your Support Team?
          </h2>
          <p className="mt-4 text-lg text-gray-300">Unlock the full potential of your customer interactions today.</p>
          <div className="mt-10">
            <a
              href="#"
              className="group relative inline-flex items-center justify-center bg-purple-600 text-white font-bold px-8 py-4 rounded-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-purple-700 transform hover:scale-105"
            >
              <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
              <span className="relative">Start Your Free Trial</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper components for cleaner structure
const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200/80 hover:border-purple-300/50 hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
    <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

const BenefitItem = ({ icon, title, description }) => (
  <li className="flex items-center text-left">
    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-green-100 rounded-full mr-6">
      {icon}
    </div>
    <div>
      <p className="text-gray-700"><span className="font-semibold text-gray-900">{title}</span> {description}</p>
    </div>
  </li>
);
