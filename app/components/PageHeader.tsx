// app/components/PageHeader.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showDivider?: boolean;
  className?: string;
  /** Optional link to a PDF or other downloadable file */
  downloadLink?: string;
  /** Optional label for the download button */
  downloadLabel?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showDivider = true,
  className,
  downloadLink,
  downloadLabel,
}) => {
  // Create a ref for the header container.
  const headerRef = useRef<HTMLDivElement>(null);
  // Track whether the header is in view.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Create an IntersectionObserver to detect when the header enters the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            // Once visible, disconnect the observer.
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    // Cleanup the observer on unmount.
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    // Attach the ref to the outer container.
    <div className={`w-full ${className}`} ref={headerRef}>
      {/* Animate the header text container */}
      <div
        className={`
          max-w-4xl mx-auto px-6 
          transition-opacity transition-transform duration-1000
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Updated flex container: adds mobile centering */}
        <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-between min-h-[12rem] py-8">
          {/* Text Section */}
          <div>
            <h1 className="text-4xl font-bold text-left mb-2">{title}</h1>
            {subtitle && (
              <h2 className="text-xl text-gray-600 dark:text-gray-400 text-left mb-4">
                {subtitle}
              </h2>
            )}
          </div>

          {/* Optional Download Button */}
          {downloadLink && (
            <div className="mt-2 md:mt-0">
              <a
                href={downloadLink}
                download
                className="
                  inline-flex items-center justify-center
                  border-2 border-pink-600 text-pink-600
                  px-4 py-2 rounded-md
                  hover:bg-pink-600 hover:text-white
                  transition-colors duration-300
                "
              >
                {downloadLabel ?? "Download PDF"}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Divider Line (if enabled) */}
      {showDivider && <hr className="border-t border-gray-300 w-full mx-0" />}
    </div>
  );
};

export default PageHeader;
