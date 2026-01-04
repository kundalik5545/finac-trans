import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="h-[84vh] w-full relative flex flex-col">
      {/* Soft Morning Mist Background */}
      <div
        className="absolute inset-0 z-0"
        style={myStyles}
      />
      <div className="relative z-10 flex flex-col">
        <Hero />
      </div>
    </div>
  );
}

// Soft Morning Mist Background
const myStyles1 = {
  backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
  backgroundSize: "40px 40px",
}


// Cyan Radial Glow Background
const myStyles = {
  backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
        `,
  backgroundSize: "40px 40px",
}


