
import Sidebar from './components/sidebar';
export default function ProfileLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="w-full h-screen flex bg-slate-50">
        {/* Include shared UI here e.g. a header or sidebar */}
       
       <Sidebar />   
        {children}
      </section>
    )
  }