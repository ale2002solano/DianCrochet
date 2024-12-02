


import LoadingSpinnerSob from "./LoadingSpinnerSob";


export default function PantallaCarga() {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50">
        
        <main className="bg-slate-50 flex-grow w-full flex justify-center">
          <LoadingSpinnerSob/>
        </main>
        
      </div>
    );
  }