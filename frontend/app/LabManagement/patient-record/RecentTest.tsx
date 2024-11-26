"use client";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect, useRef } from "react";

export default function RecentTestsCell({
  tests,
}: {
  tests: string[];
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = 3;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={containerRef}
            className="flex flex-wrap gap-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {tests
              .slice(0, isExpanded ? tests.length : displayCount)
              .map((test, index) => (
                <Badge key={index} variant="secondary">
                  {test}
                </Badge>
              ))}
            {!isExpanded && tests.length > displayCount && (
              <Badge variant="secondary">+{tests.length - displayCount}</Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to {isExpanded ? "collapse" : "expand"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
