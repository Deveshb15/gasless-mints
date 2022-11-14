import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-extrabold">Gasless mints biconomy</h1>
        <ConnectButton />
      </div>
    </div>
  );
}

export default App;
