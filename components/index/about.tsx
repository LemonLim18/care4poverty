import Image from "next/image";


export const About = () => {
  return (
    <section id ="#about" className="relative flex flex-col md:flex-row items-center justify-between h-screen">
      {/* For small screens */}
        <div className="md:hidden flex flex-col justify-center items-center w-full mt-16">
          <h1 data-aos="fade-up" data-aos-duration="1500" className="font-giorgio font-bold text-7xl mb-4 text-center">About Us</h1>

          <Image
            data-aos="fade-up" data-aos-duration="1500"
            src="/images/aboutUs.png"
            alt="About Us"
            width={600}
            height={600}
            className="w-full max-w-sm my-4"
          />

          <p data-aos="fade-up" data-aos-duration="1500" className="font-roboto text-md text-center mt-2 mx-4">
            Care4Poverty is an all-in-one platform connecting charities, donors, volunteers, and beneficiaries, streamlining the management and distribution of essential resources like food, education materials, and financial aid.
          </p>
        </div>
      
      {/* For medium and larger screens */}
      <div data-aos="fade-up" data-aos-duration="1500" className="hidden md:flex flex-1 justify-center items-center w-full">
        <Image
          data-aos="fade-up" data-aos-duration="1500"
          src="/images/aboutUs.png"
          alt="About Us"
          width={600}
          height={600}
          className="w-full max-w-md"
        />
      </div>
      <div data-aos="fade-up" data-aos-duration="1500" className="hidden md:flex flex-1 flex-col justify-center w-full h-full px-16">
        <h1 className="font-giorgio font-bold text-7xl mb-4">About Us</h1>
        <p className="font-roboto text-md">
          Care4Poverty is an all-in-one platform connecting charities, donors, volunteers, and beneficiaries, streamlining the management and distribution of essential resources like food, education materials, and financial aid.
        </p>
      </div>
    </section>


  );
};
