'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/data/messages.json'
import autoPlay from 'embla-carousel-autoplay'

const Home = () => {
  return (
    <main className="min-h-screen flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-200 text-black transition duration-300 ease-in-out">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight  transition duration-200">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-lg md:text-xl font-light">
          Anonymous Feedback - Where your identity remains a secret.
        </p>
      </section>
      <Carousel
        plugins={[autoPlay({ delay: 2000 })]}
        className="w-full max-w-lg md:max-w-2xl">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="bg-gray-700  text-white transition duration-200 rounded-lg shadow-lg">
                  <CardHeader className="font-semibold text-xl border-b border-gray-600">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex h-40 items-center justify-center p-4">
                    <span className="text-2xl md:text-3xl font-medium text-center">
                      {message.content}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 transition duration-200" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 transition duration-200" />
      </Carousel>
    </main>
  )
}

export default Home;
