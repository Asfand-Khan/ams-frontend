import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";
import { Button } from "../shadcn/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefetchDatatableProps {
  isRefetching?: boolean;
  handleRefetch?: () => void;
}

const RefetchDatatable: React.FC<RefetchDatatableProps> = ({
  handleRefetch,
  isRefetching,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline" size="sm" type="button"
          onClick={handleRefetch}
        >
          <RefreshCw size={26} className={cn(isRefetching && "animate-spin")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isRefetching ? <p>Refetching...</p> : <p>Refetch Data</p>}
      </TooltipContent>
    </Tooltip>
  );
};

export default RefetchDatatable;
