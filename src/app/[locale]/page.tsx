import { Hero } from "@/sections/Hero/Hero";
import { About } from "@/sections/About/About";
import { Skills } from "@/sections/Skills/Skills";
import { Projects } from "@/sections/Projects/Projects";
import { Contact } from "@/sections/Contact/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
