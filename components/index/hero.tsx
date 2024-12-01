import Image from "next/image";

interface HeroProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  imageSrc,
  title,
  subtitle,
  buttonText,
  onButtonClick,
}) => {
  return (
    <section id="#" className="relative flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* Background Image */}
      {/* Initial: -z-10; After: z-10 */}
      <div className="absolute inset-0 z-10">
        <Image
          src={imageSrc}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl px-4 text-center flex flex-col items-center justify-center">
        <h1 className="font-roboto text-5xl lg:text-6xl font-bold mb-4 whitespace-nowrap">{title}</h1>
        <p className="font-roboto text-lg sm:text-xl mb-8">{subtitle}</p>
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="px-8 py-3 bg-[#0077B6] rounded-md text-white font-semibold transition-colors hover:[#0077B6]"
          >
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
};
