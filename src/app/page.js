import Testimonails from "@/components/sections/Testimonails";
import { Button } from "flowbite-react";

const Home = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <section id="testimonials">
        {" "}
        <Testimonails />
      </section>
    </div>
  );
};

export default Home;
