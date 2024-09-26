"use client";

import { Card } from "flowbite-react"; 
import { motion } from "framer-motion"; 
import { useState } from "react"; 
import { HiPlus, HiMinus } from "react-icons/hi"; 

const FAQSection = () => {
  // FAQ data 
  const faqs = [
    {
      question: "🎥 What is Cinestream?",
      answer:
        "Cinestream is a premium streaming service that offers an extensive library of movies and TV shows across various genres, designed for an exceptional viewing experience.",
    },
    {
      question: "📱 What devices can I use to watch Cinestream?",
      answer:
        "Cinestream is compatible with a variety of devices including smartphones, tablets, smart TVs, and web browsers, allowing you to watch anywhere.",
    },
    {
      question: "🔍 How do I search for movies and shows?",
      answer:
        "You can use the search bar at the top of the page to quickly find your favorite movies and shows by title, genre, or actor.",
    },
    {
      question: "🌐 Is Cinestream available worldwide?",
      answer:
        "Cinestream is available in many countries! Check our website for availability and specific content libraries in your region.",
    },
    {
      question: "⭐ Can I rate or review shows and movies?",
      answer:
        "Yes! You can rate and review shows to help others in the Cinestream community find the best content to watch.",
    },
    {
      question: "💳 How do I manage my subscription?",
      answer:
        "You can manage your subscription through your account settings. From there, you can upgrade, downgrade, or cancel your subscription anytime.",
    },
  ];

  // State to manage the open FAQ
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle function to handle FAQ open/close
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); 
  };

  return (
    <motion.section
      className="pt-16 pb-20 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.3 }} 
    >
      <h2 className="text-4xl font-bold mb-6 text-purple-700 text-center">
        Frequently Asked Questions
      </h2>
      <p className="text-lg mb-10 text-gray-600 dark:text-gray-400 text-center max-w-2xl px-4">
        Here are some common questions about Cinestream. If you have any other inquiries, feel free to reach out!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl px-4">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => toggleFAQ(index)} 
          >
            <div className="flex justify-between items-center p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {faq.question}
              </h3>
              <span className="text-gray-500">
                {openIndex === index ? (
                  <HiMinus className="w-6 h-6" /> 
                ) : (
                  <HiPlus className="w-6 h-6" /> 
                )}
              </span>
            </div>
            {openIndex === index && ( 
              <div className="p-4 border-t border-gray-300 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-justify">{faq.answer}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </motion.section>
  );
};

export default FAQSection;
