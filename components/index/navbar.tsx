import { useState, useEffect } from "react";
import Link from "next/link"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

// For entering new props from the component called
interface NavbarProps {
  className?: string
}

// React.FC<NavbarProps> uses the interface NavbarProps
// ({className}) destructures the property from the interface type
export const Navbar: React.FC<NavbarProps> = ({className}) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const handleLoginRedirect = () => {
    router.push("/auth/login");
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setShowNavbar(false); // hide navbar on scroll down
      } else {
        setShowNavbar(true); // show navbar on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "auto"; // Reset scrolling when component unmounts
    }
  }, [lastScrollY, isDrawerOpen]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${className}`}
    >
      <div className=" px-[16px] md:px-10 md:pl-8 lg:px-12 lg:pl-8"> {/*Originally add 'container' to make it space horizontally*/}
        <div className="flex h-20 items-center"> {/* originally h-14 */}
          <Link href="#" className="mr-auto flex items-center gap-2 text-lg font-semibold" prefetch={false}>
            <Image
              className="dark:invert"
              src="/images/logo.png"
              alt="Care4Poverty Logo"
              width={130}
              height={40}
              priority
            />
            {/* <span>Acme Inc</span> */}
          </Link>

          {/* burger menu navbar on smaller screen */}
          <nav className="ml-auto flex md:hidden items-center space-x-7">
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              onClick={toggleDrawer}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded={isDrawerOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </nav>

          {/* full navbar on larger-screen */}
          <nav className="ml-auto hidden md:flex items-center space-x-7">
            {["Home", "About", "Objective", "Get Involved", "FAQ", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="font-giorgio font-bold text-2xl border-b-2 border-transparent transition-colors hover:text-[#0077B6] hover:border-gray-100 dark:hover:text-gray-50 dark:hover:border-gray-800"
                prefetch={false}
              >
                {item}
              </Link>
            ))}
            <Button
              className="bg-[#0077B6] hover:bg-[#026194] transition ease-in-out text-white font-bold py-6 px-6 w-auto rounded-full inline-flex items-center"
              onClick={handleLoginRedirect}
            >
              Login
            </Button>
          </nav>
        </div>
      </div>

      {/* Higher-index Drawer */}
      {/* full for smallest screen, half for smaller screen, hide it when larger screen (full navbar) */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-1/2 md:hidden h-[100vh] bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-white h-full px-6 flex flex-col justify-between">
          {/* Only the x button and the list of items, excluding the login button */}
            <button
              className="flex flex-row-reverse sm:flex-row-reverse sm:mr-4 my-6 text-gray-500 dark:text-gray-400"
              onClick={toggleDrawer}
            >
              <svg
                className="w-8 h-8"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ul className="h-full pt-2 pl-4 flex flex-col items-center sm:items-start gap-y-4">
              {["Home", "About", "Objective", "Get Involved", "FAQ", "Contact"].map((item) => (
                <li 
                  key={item}
                >
                  <Link
                    key={item}
                    href="#"
                    className="font-giorgio font-bold text-2xl border-b-2 border-transparent transition-colors hover:text-[#0077B6] hover:border-gray-100 dark:hover:text-gray-50 dark:hover:border-gray-800"
                    prefetch={false}
                  >
                    {item}
                  </Link>
                </li>
              ))
              }
            </ul>
          <Button
              className="my-7 bg-[#0077B6] hover:bg-[#026194] transition ease-in-out text-white font-bold py-6 px-6 w-auto rounded-full inline-flex items-center"
              onClick={handleLoginRedirect}
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}

const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
