export default function MobileSplash() {
  return (
    <div className="md:hidden flex flex-col items-center justify-center min-h-screen w-full bg-[#fffdf6] p-8 text-center text-[#3D495A]">
      <img 
        src="/logofull.svg" 
        alt="Logo" 
        className="w-48 max-w-full h-auto mb-8" 
      />
      <h1 className="text-2xl font-bold mb-4 font-perfectly-nineties">
        Desktop or Laptop Experience Recommended.
      </h1>
      <p className="text-base font-sans">
        I am currently fine-tuning the mobile experience.
      </p>
    </div>
  );
}
