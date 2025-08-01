import { Calendar } from "lucide-react";

export const WelcomePanel = () => {
  return (
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome Back to EventFlow
        </h1>
        <p className="text-xl text-center opacity-90 max-w-md">
          Continue your journey of discovering amazing events and creating
          unforgettable memories.
        </p>
      </div>
      <img
        src="./vite.svg?height=800&width=600"
        alt="Event venue"
        className="absolute inset-0 object-cover opacity-20 w-full h-full"
      />
    </aside>
  );
};
