'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { MessageSquare, Shield, Lock, Zap, ArrowRight } from "lucide-react"
import messages from '@/data/messages.json'
import autoPlay from 'embla-carousel-autoplay'
import { useRouter } from "next/navigation"

const Home = () => {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#0A0F1C]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#0A0F1C]"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-6 animate-fade-in">
            Share Your Thoughts
            <br />
            <span className="text-white">Without Boundaries</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Express yourself freely in a secure, anonymous environment where every voice matters and every story finds its audience.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/sign-in")}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full group transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/about")}
              className="border-2 border-blue-500 text-blue-400 hover:bg-blue-950/50 text-lg px-8 py-6 rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0A0F1C] to-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "100% Anonymous", desc: "Share your thoughts without revealing your identity" },
              { icon: Lock, title: "Secure Authentication", desc: "Enterprise-grade security protocols" },
              { icon: Zap, title: "AI-Powered", desc: "Smart suggestions powered by OpenAI" },
              { icon: MessageSquare, title: "Interactive UI", desc: "Smooth and engaging user experience" }
            ].map((feature, i) => (
              <Card key={i} className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm text-white hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-blue-600 rounded-full w-fit">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-[#0A0F1C]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            What Our Users Say
          </h2>
          <Carousel opts={{ loop: true }} plugins={[autoPlay({ delay: 3000 })]} className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-gradient-to-t from-[#0A0F1C] to-[#16213c]  backdrop-blur-sm text-white mx-4">
                    <CardContent className="p-8 text-center">
                      <p className="text-2xl font-light italic mb-6">"{message.content}"</p>
                      <p className="text-blue-400 font-semibold">{message.title}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex text-white border-gray-700 bg-blue-600 hover:bg-blue-700" />
            <CarouselNext className="hidden md:flex text-white border-gray-700 bg-blue-600 hover:bg-blue-700" />

          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0A0F1C] to-blue-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of users who trust our platform for meaningful conversations.
          </p>
          <Button
            onClick={() => router.push("/sign-in")}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-6 rounded-full group transition-all duration-300"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </main>
  )
}

export default Home