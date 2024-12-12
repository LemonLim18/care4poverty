import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const carouselItems = [
  {
    title: "Free Education Opportunities",
    description: "Enjoy new knowledge and skills through diverse, freely available resources.",
    imageUrl: "/images/education.png",
  },
  {
    title: "Support Local Charities",
    description: "Contribute to initiatives that strengthen and uplift communities in need everywhere.",
    imageUrl: "/images/localCharity.jpg",
  },
  {
    title: "Donate Essentials",
    description: "Provide vital resources such as food, clothing, and supplies for families in need.",
    imageUrl: "/images/donation.jpeg",
  },
  {
    title: "Volunteer Your Time",
    description: "Get involved by assisting in events and programs that help the community.",
    imageUrl: "/images/volunteer.jpg",
  },
  {
    title: "Spread Awareness",
    description: "Advocate for underrepresented groups by sharing their stories and challenges widely.",
    imageUrl: "/images/charity_awareness.png",
  },
];

export const GetInvolve = () => {
    return (
      <section id="#get-involved" className="relative flex flex-col items-center justify-center h-screen">
        <h1 data-aos="fade-up" data-aos-duration="1500" className="font-giorgio font-bold text-7xl mb-10">Get Involved, Support</h1>
        {/* <p className="text-center text-lg">Care4Poverty is an all-in-one platform connecting charities, donors, volunteers, and beneficiaries, streamlining the management and distribution of essential resources like food, education materials, and financial aid.</p> */}
        {/* // 50% on small screens and 33% on larger screens. */}
        <Carousel 
          data-aos="fade-up" data-aos-duration="1500"
          className="w-full max-w-xl lg:max-w-2xl"
          plugins={[
            Autoplay({
              delay: 3750,
            }),
          ]}
        >
          <CarouselContent>
  {carouselItems.map((item, index) => (
    <CarouselItem key={index}>
      <div className="p-1 h-full">
        <Card className="relative overflow-hidden h-full w-full max-h-[30.5rem]">
          {/* Top Half: Image */}
          <CardContent className="h-[55%] p-0">
            <img
              src={item.imageUrl}
              alt={`Image ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </CardContent>

          {/* Bottom Half: Content */}
          <CardContent className="h-[45%] bg-[#0077B6] text-white flex flex-col justify-center pb-4 px-10">
            <h3 className="text-xl my-4 font-semibold">{item.title}</h3>
            <p className="text-md mb-4">{item.description}</p>
            <a href={item.imageUrl} className="my -3 text-white font-bold hover:underline">
              &gt;&gt; Explore more
            </a>
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
  