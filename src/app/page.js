import ActionSection from "@/components/sections/ActionSection";
import FAQSection from "@/components/sections/FAQSection";
import HeroSection from "@/components/sections/HeroSection";
import MovieCardSection from "@/components/sections/MovieCardSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import TvSeriesCardSection from "@/components/sections/TvSeriesCardSection";

const MainPage = () => {
  return (
    <main>
      <section id="hero">
        <HeroSection />
      </section>
      <section id="movieCard">
        <MovieCardSection />
      </section>
      <section id="tvSeriesCard">
        <TvSeriesCardSection />
      </section>
      <section id="FAQ">
        <FAQSection />
      </section>
      <section id="testimonials">
        <TestimonialSection />
      </section>
      <section id="action">
        <ActionSection/>
      </section>
    </main>
  );
};

export default MainPage;
