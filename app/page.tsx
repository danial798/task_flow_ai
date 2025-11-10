import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Brain, TrendingUp, MessageCircle, Calendar, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Goals Into Reality
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Intelligent goal planning powered by AI. Break down ambitious goals into actionable steps,
            track progress, and stay motivated with your personal AI productivity coach.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Planning Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-12 w-12 text-blue-600" />}
            title="AI-Powered Goal Breakdown"
            description="Transform any goal into a structured roadmap with intelligent task breakdown, timelines, and milestones."
          />
          <FeatureCard
            icon={<MessageCircle className="h-12 w-12 text-purple-600" />}
            title="AI Productivity Coach"
            description="Get personalized advice, overcome obstacles, and receive motivation tailored to your journey."
          />
          <FeatureCard
            icon={<TrendingUp className="h-12 w-12 text-green-600" />}
            title="Smart Progress Tracking"
            description="Dynamic timelines that adjust based on your progress with intelligent forecasting and insights."
          />
          <FeatureCard
            icon={<Calendar className="h-12 w-12 text-orange-600" />}
            title="Adaptive Planning"
            description="Plans that evolve with you. Life changes, and your roadmap adapts automatically."
          />
          <FeatureCard
            icon={<Award className="h-12 w-12 text-red-600" />}
            title="Weekly Reflections"
            description="AI-generated summaries analyzing your progress, challenges, and providing actionable insights."
          />
          <FeatureCard
            icon={<Target className="h-12 w-12 text-indigo-600" />}
            title="Goal Templates"
            description="Pre-built templates for common goals like startup launch, exam prep, fitness, and more."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-12">
            <Step
              number="1"
              title="Describe Your Goal"
              description="Tell us what you want to achieve. Be as specific or broad as you like."
            />
            <Step
              number="2"
              title="AI Creates Your Roadmap"
              description="Our AI analyzes your goal and generates a detailed, actionable plan with tasks, resources, and timelines."
            />
            <Step
              number="3"
              title="Track & Execute"
              description="Follow your personalized roadmap, mark progress, and get AI coaching along the way."
            />
            <Step
              number="4"
              title="Reflect & Improve"
              description="Receive weekly AI-powered insights to optimize your approach and stay motivated."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Achieve Your Goals?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are turning their dreams into reality with TaskFlow AI
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started For Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 TaskFlow AI. Built with ❤️ using AI and modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-6">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    </div>
  );
}

