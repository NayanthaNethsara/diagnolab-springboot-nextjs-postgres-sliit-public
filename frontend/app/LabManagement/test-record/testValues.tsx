import { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import { Test } from "./columns";

interface ExpandableTestsTableProps {
  tests: Test[];
}

const ExpandableTestsTable: React.FC<ExpandableTestsTableProps> = ({
  tests,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
    <div className="flex justify-between items-center" ref={containerRef}>
      <Table className="w-full">
        <TableBody>
          {(isExpanded ? tests : tests.slice(0, 1)).map((test) => (
            <TableRow key={test.name}>
              <TableCell className="text-left w-32">{test.name}</TableCell>
              <TableCell className="text-center">{test.value}</TableCell>
              <TableCell className="text-right">{test.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tests.length > 1 && (
        <button className="ml-4 flex items-center" onClick={toggleExpand}>
          {!isExpanded ? (
            <ChevronDownIcon className="w-5 h-5" />
          ) : (
            <ChevronUpIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default ExpandableTestsTable;
