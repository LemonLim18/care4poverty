import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Faq = () => {
  const faqItems = [
    {
      value: "item-1",
      question: "What is this platform about?",
      answer: "Our platform connects donors, charitable organizations, and individuals in need to streamline the donation and distribution process.",
    },
    {
      value: "item-2",
      question: "Who can use this platform?",
      answer: "Anyone can use our platform to donate, volunteer, or request assistance. Charitable organizations can also use it to manage and distribute resources effectively.",
    },
    {
      value: "item-3",
      question: "Is this service available outside Penang?",
      answer: "Currently, our services are only available in Penang. We plan to expand to other regions in the future.",
    },
    {
      value: "item-4",
      question: "How can I donate items?",
      answer: "You can donPe items by registering on our platform and scheduling a pickup. We’ll handle the collection and delivery to the intended recipients.",
    },
    {
      value: "item-5",
      question: "How are donations distributed?",
      answer: "Donations are distributed based on the needs registered by charitable organizations and verified individuals, ensuring resources go to those who need them most.",
    },
    {
      value: "item-6",
      question: "Is my donation tax-deductible?",
      answer: "Yes, donations made through our platform are eligible for tax deductions. A receipt will be provided after your donation is processed.",
    },
    {
      value: "item-7",
      question: "How do I know my donation has reached the recipient?",
      answer: "You will receive a confirmation notification once your donation has been successfully delivered to the recipient.",
    },
  ];

  return (
    <section
      id="#faq"
      className="relative flex-col items-center justify-center h-screen px-16 py-20"
    >
      <h1
        data-aos="fade-up"
        data-aos-duration="1500"
        className="font-giorgio font-bold text-7xl text-center mb-16"
      >
        Frequently Asked Questions
      </h1>
      <Accordion
        data-aos="fade-up"
        data-aos-duration="1500"
        type="single"
        collapsible
        className="w-full"
      >
        {faqItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
