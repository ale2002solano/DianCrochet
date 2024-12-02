'use client';
import VideoPage from './components/video'; 

import Footer from 'components/Footer';

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">  
        
      <main className="bg-slate-50 flex-grow w-full mt-10">
        <div className="flex  justify-center items-center mt-[40px]">
        <VideoPage/>
        </div>
      </main>

      <Footer />
    </div>
  );
}
