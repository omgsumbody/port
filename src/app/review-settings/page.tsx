import Link from 'next/link';

export default function ReviewSettings() {
    return (
        <div className="flex w-full min-h-screen bg-white">
            {/* Left sticky navigation */}
            <aside className="w-[256px] h-screen sticky top-0 border-r border-grey-10 shrink-0 bg-white">
                {/* 64px height container */}
                <div className="h-[64px] flex items-center border-b border-grey-10">
                    <Link 
                        href="/" 
                        className="ml-[28px] w-[32px] h-[32px] bg-red-100 rounded flex items-center justify-center text-red-500 font-bold hover:bg-red-200 transition-colors"
                        aria-label="Home"
                    >
                        {/* Placeholder Logo */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </Link>
                </div>
                {/* Navigation Items */}
                <nav className="p-4 flex flex-col gap-2">
                    <p className="font-inter font-medium text-[14px] leading-[20px] text-grey-80 mb-2 px-3">
                        Review Settings
                    </p>
                    <div className="px-3 py-2 rounded-lg bg-grey-10 text-grey-100 font-inter font-medium text-[14px]">
                        General
                    </div>
                </nav>
            </aside>

            {/* Main Page Content */}
            <main className="flex-1 p-[48px] overflow-y-auto">
                <div className="max-w-[800px]">
                    <h1 className="font-inter font-medium text-[48px] leading-[46px] text-grey-100 mb-6">
                        Review Settings Content
                    </h1>
                    <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80">
                        This is the temporary page content for Review Settings. Once the transition is complete, the user can navigate back to the home page using the logo in the top left corner of the navigation sidebar.
                    </p>
                </div>
            </main>
        </div>
    );
}
