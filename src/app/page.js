import FAQSection from "@/components/sections/FAQSection";
import HeroSection from "@/components/sections/HeroSection";
import MovieCardSection from "@/components/sections/MovieCardSection";
import TestimonialSection from "@/components/sections/TestimonialSection";

const MainPage = () => {
  return (
    <main>
      <section id="hero">
        <HeroSection />
      </section>
      <section id="movieCard">
        <MovieCardSection />
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
