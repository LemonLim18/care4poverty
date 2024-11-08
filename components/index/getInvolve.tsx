import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


export const GetInvolve = () => {
    return (
      <section className="relative flex flex-col items-center justify-center h-screen border-2">
        <h1 data-aos="fade-up" data-aos-duration="1500" className="font-giorgio font-bold text-7xl mb-10">Get Involved, Support</h1>
        {/* <p className="text-center text-lg">Care4Poverty is an all-in-one platform connecting charities, donors, volunteers, and beneficiaries, streamlining the management and distribution of essential resources like food, education materials, and financial aid.</p> */}
        {/* // 50% on small screens and 33% on larger screens. */}
        <Carousel 
          data-aos="fade-up" data-aos-duration="1500"
          className="w-full max-w-xs"
          plugins={[
            Autoplay({
              delay: 3750,
            }),
          ]}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </section>
    );
  };
  