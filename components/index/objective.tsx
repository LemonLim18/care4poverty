import React from "react";
import {
  LightBulbIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import objImage1 from "../../public/images/objective1.jpg"
import objImage2 from "../../public/images/objective2.jpg"
import objImage3 from "../../public/images/objective3.png"

const services = [
  {
    step: "01",
    name: "Donation  Platform",
    imageUrl:
      objImage1,
    description:
      "A centralized system that connects donors, charitable organizations, and individuals in need, streamlining the donation process for maximum impact.",
  },
  {
    step: "02",
    name: "Resource Management",
    imageUrl:
        objImage2,
    description:
      "Efficient tools for tracking, managing, and distributing resources, ensuring donations reach those who need them most.",
  },
  {
    step: "03",
    name: "Collection & Delivery",
    imageUrl:
        objImage3,
    description:
      "An integrated system for seamless and timely transfer of donated items, from pickup to delivery.",
  },
];

export const Objective = () => {
  return (
    // <section className="py-16 mx-auto sm:py-20">
    <section id="#objective" className="mx-auto">
      <div className="mx-auto flex justify-center object-center px-4 py-16 sm:py-24 lg:max-w-7xl">
        <div className="flex justify-center object-center flex-col gap-12 sm:gap-16">
          <h1 data-aos="fade-up" data-aos-duration="1500" className="font-giorgio font-bold text-center text-7xl">Our Objectives</h1>
          {/* <p className="text-center text-lg">Care4Poverty is an all-in-one platform connecting charities, donors, volunteers, and beneficiaries, streamlining the management and distribution of essential resources like food, education materials, and financial aid.</p> */}
          <div data-aos="fade-up" data-aos-duration="1500" className="mx-auto grid gap-12 space-y-10 md:space-y-0 sm:gap-16 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              // Each card component as a grid item
              <div
                key={service.name}
                className={`group h-96 w-[22rem] lg:w-[29vw] max-w-96 [perspective:1000px] ${index === 2 ? "md:col-span-2 md:mx-auto lg:col-span-1" : ""}`} // Center the third card in 2-column grid
              >
                <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front face with image */}
                  <div className="absolute inset-0 flex justify-center items-center h-full w-full rounded-xl [backface-visibility:hidden]">
                    {service.imageUrl && (
                      <Image
                        className="object-cover cursor-pointer w-full h-full rounded-xl"
                        src={service.imageUrl}
                        alt={service.name}
                        width={320}
                        height={320}
                      />
                    )}
                    {/* <p className=" md:my-6 text-2xl">{service.name}</p> */}
                  </div>
                  {/* Back face with text */}
                  <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="flex min-h-full flex-col items-center justify-center">
                      <h2 className="text-[#0077B6] text-4xl font-heavy mb-4 font-giorgio">
                        {service.name}
                      </h2>
                      <p className="font-roboto text-lg text-pretty text-center mb-4 ">
                        {service.description}
                      </p>
                      {/* <a href="#" className="inline-flex">
                        <button className="my-2 bg-[#0077B6] hover:bg-[#0077B6] text-white font-bold py-2 px-4 w-auto rounded-full inline-flex items-center">
                          <span>Schedule Service</span>
                          <WrenchScrewdriverIcon className="h-6 w-6 ml-2" />
                        </button>
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  );
};

// export default Objective;