"use client";

import React, { useMemo } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function GiscusComments() {
  const { theme } = useTheme();

  // Map your site’s theme to one of Giscus's supported theme strings
  const giscusTheme = useMemo(() => {
    if (theme === "dark") {
      // Examples: "dark", "dark_dimmed", "transparent_dark", "dark_high_contrast"
      return "transparent_dark";
    }
    // Fallback for light or system
    return "light_protanopia";
  }, [theme]);

  return (
    <div className="mt-8">
      <Giscus
        repo="iMilesHo/MPPComments"
        repoId="R_kgDON2j7FQ"
        category="Announcements"
        categoryId="DIC_kwDON2j7Fc4CmyS-"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={giscusTheme}
        lang="en"
        loading="lazy"
        // Optional: force re-initialization when theme changes
        key={giscusTheme}
      />
    </div>
  );
}
