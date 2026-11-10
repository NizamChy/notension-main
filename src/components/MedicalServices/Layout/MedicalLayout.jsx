// Shared layout primitives for every Medical Services page, so all pages use
// the same container width, gutters, vertical rhythm and heading style.

export const MedicalPageHeader = ({ title }) => (
  <h1 className="text-center py-3 text-base lg:text-xl font-medium text-primaryFood bg-[#FFF1EA]">
    {title}
  </h1>
);

export const MedicalContainer = ({ children, className = "" }) => (
  <div className={`max-w-screen-xl mx-auto px-4 md:px-6 ${className}`}>
    {children}
  </div>
);

// Page body: same container plus consistent top/bottom padding and the same
// gap between every section on the page.
export const MedicalPageBody = ({ children, className = "" }) => (
  <MedicalContainer
    className={`py-6 md:py-8 space-y-8 md:space-y-10 ${className}`}
  >
    {children}
  </MedicalContainer>
);

export const MedicalSectionTitle = ({ children, className = "" }) => (
  <h2
    className={`text-lg md:text-2xl font-semibold text-[#0C3F8E] mb-4 md:mb-5 ${className}`}
  >
    {children}
  </h2>
);

// Grid used for every list of doctor / center cards: items stretch so all
// cards in a row share top and height.
export const MedicalCardGrid = ({ children, className = "" }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}
  >
    {children}
  </div>
);
