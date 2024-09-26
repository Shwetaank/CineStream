import FAQSection from "@/components/sections/FAQSection";
import HeroSection from "@/components/sections/HeroSection";
import TestimonialSection from "@/components/sections/TestimonialSection";

const MainPage = () => {
  return (
    <main>
      <section id="heroSection">
        <HeroSection />
      </section>
      <section id="FAQ">
        <FAQSection />
      </section>
      <section id="testimonials">
        <TestimonialSection />
      </section>
    </main>
  );
};

export default MainPage;
