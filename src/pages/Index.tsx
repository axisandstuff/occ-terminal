import Terminal from "@/components/Terminal";
import PoweredByAxis from "@/components/PoweredByAxis";

const Index = () => (
  <div className="min-h-screen w-full bg-black flex flex-col">
    <div className="flex-1 flex flex-col">
      <Terminal />
    </div>
    <PoweredByAxis />
  </div>
);

export default Index;
