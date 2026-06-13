import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppOrb from "@/components/WhatsAppOrb";
import Preloader from "@/components/Preloader";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";
import CursorSparks from "@/components/CursorSparks";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Benefits from "@/pages/Benefits";
import Achievements from "@/pages/Achievements";
import SuccessStories from "@/pages/SuccessStories";
import FAQs from "@/pages/FAQs";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <Preloader />
      <CursorSparks />
      <BrowserRouter>
        <ScrollProgress />
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <WhatsAppOrb />
        <ElevenLabsWidget />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A0A0E",
              border: "1px solid rgba(192,57,43,0.3)",
              color: "#fff",
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
