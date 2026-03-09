import TopNavigation from "@/components/TopNavigation";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="sticky top-0 z-50">
                <TopNavigation />
            </header>

            <main className="flex-grow">
                <section className="about-hero-section w-full">
                    {/* About Hero Section */}
                    <div className="w-full h-[calc(100vh-200px)] py-20 px-[56px] text-center text-gray-400 flex items-center justify-center">
                        {/* Empty About Hero Section Placeholder */}
                        About Hero Section Empty
                    </div>
                </section>

                <section className="about-main-body w-full">
                    {/* About Main Body */}
                    <div className="w-full h-[700px] border-2 border-dashed border-blue-500 py-20 px-[56px] text-center text-gray-400 flex items-center justify-center">
                        {/* Empty About Main Body Placeholder */}
                        About Main Body Empty
                    </div>
                </section>
            </main>

            <footer className="footer-section w-full">
                {/* Footer */}
                <div className="w-full h-[500px] border-2 border-dashed border-green-500 py-20 px-[56px] text-center text-gray-400 flex items-center justify-center">
                    {/* Empty Footer Placeholder */}
                    Footer Empty
                </div>
            </footer>
        </div>
    );
}
