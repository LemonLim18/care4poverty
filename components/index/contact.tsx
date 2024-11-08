import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const Contact = () => {
    return (
      <section className="relative bg-[#0077B6] flex flex-col items-center justify-center h-screen p-8 space-y-6 border-2">
        {/* Text content section */}
        <div data-aos="fade-up" data-aos-duration="1500" className="text-center w-full max-w-2xl space-y-12">
          <h1 className="font-giorgio font-bold text-7xl text-white">Stay Updated</h1>
          <p className="text-white text-lg ">
            Sign up to our newsletter and hear about the big ideas and new campaigns, taking place all around the world, that are helping to drive progress towards the Global Goals.
          </p>
        </div>

        {/* Input and Button section */}
        <div data-aos="fade-up" data-aos-duration="1500" className="flex w-full max-w-sm items-center space-x-2">
          <Input className="bg-white" type="email" placeholder="Email" />
          <Button type="submit">Subscribe</Button>
        </div>
      </section>
    );
};

  