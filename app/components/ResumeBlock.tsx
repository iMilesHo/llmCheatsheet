// app/components/ResumeBlock.tsx
import React from "react";

interface ResumeBlockProps {
  title: string;
  titleLink?: string; // optional link for the title
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  address?: string;
  bullets?: string[]; // array of bullet-point lines
}

export default function ResumeBlock({
  title,
  titleLink,
  subtitle,
  startDate,
  endDate,
  address,
  bullets,
}: ResumeBlockProps) {
  return (
    <div className="mb-6">
      {/* Title + Date row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
        {/* If a link is provided, wrap the title with <a>, else just render text */}
        <h3 className="text-lg font-semibold">
          {titleLink ? (
            <a
              href={titleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
          {startDate} – {endDate}
        </div>
      </div>

      {/* Subtitle + Address row */}
      {(subtitle || address) && (
        <div className="text-sm italic flex flex-col sm:flex-row sm:justify-between sm:items-baseline mt-1">
          <span>{subtitle}</span>
          <span className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
            {address}
          </span>
        </div>
      )}

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="list-disc list-inside mt-2 space-y-1">
          {bullets.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
