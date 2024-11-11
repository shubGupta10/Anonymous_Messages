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
import { MessageSquare, Shield, Lock, Zap } from "lucide-react" 
import messages from '@/data/messages.json'
import autoPlay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useRouter } from "next/navigation"

interface Icons {
  icon: React.ElementType;
  title: string;
  description: string;
}


const FeatureCard: React.FC<Icons> = ({ icon: Icon, title, description }) => (
  <Card className="bg-gradient-to-r from-gray-800 to-black p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 p-3 bg-blue-700 rounded-full">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </Card>
);


const Home = () => {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [autoPlay({ delay: 3000 })]);
  const router = useRouter()

  const sendtoLogin = () => {
    router.push("/sign-in")
  }

  const sendtoRegister = () => {
    router.push("/sign-in")
  }

  return (
    <main className="min-h-screen flex-grow flex flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative w-full px-4 py-20 text-center bg-gradient-to-br from-blue-800 to-black text-white">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: 'url("/path-to-background-image.jpg")' }}></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 animate-fade-in">
            Share Your Thoughts Without Boundaries
          </h1>
          <p className="mt-3 md:mt-4 text-lg md:text-2xl font-light mb-8">
            Express yourself freely in a safe, anonymous environment where every voice matters.
          </p>
          <Button onClick={sendtoLogin} className="bg-blue-500 hover:bg-blue-400 text-lg px-8 py-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
            Start Sharing Now
          </Button>
        </div>
      </section>


      {/* Testimonial Carousel */}
      <section className="w-full py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">What People Are Saying</h2>
        <Carousel plugins={[autoPlay({ delay: 3000 })]} className="w-full max-w-lg md:max-w-2xl mx-auto">
          <CarouselContent className="flex gap-4">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="flex-none w-full">
                <Card className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <CardHeader className="font-semibold text-xl p-4 border-b border-blue-600">
                    {message.title}
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <p className="text-2xl md:text-3xl font-medium">{message.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-600 p-2 rounded-full shadow-md" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-600 p-2 rounded-full shadow-md" />
        </Carousel>
      </section>


      {/* Features Grid */}
      <section className="w-full py-16 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={Shield} title="100% Anonymous" description="Your identity is completely protected. Share without fear." />
            <FeatureCard icon={Lock} title="100% Secure with Authentication" description="Your messages are secured with authentication protocols." />
            <FeatureCard icon={Zap} title="OpenAI Integration" description="Get smart suggestions with AI-powered insights." />
            <FeatureCard icon={MessageSquare} title="Interactive UI" description="Enjoy a smooth and engaging user experience." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-gradient-to-br from-blue-900 to-black text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Share Your Story?</h2>
          <p className="text-xl mb-8">Join thousands of users who trust our platform for anonymous communication.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={sendtoRegister} className="bg-gradient-to-r from-blue-500 to-blue-700 text-lg px-8 py-4 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
              Create Account
            </Button>
            <Button onClick={sendtoRegister} className="border-2 border-blue-500 hover:bg-blue-700 hover:text-white text-lg px-8 py-4 rounded-full transition duration-300">
              Learn More
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
