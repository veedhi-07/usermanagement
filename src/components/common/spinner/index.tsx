import { Spinner } from "flowbite-react";
import React from "react";
const LoadSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="xl" aria-label="Loading users..." />
    </div>
  );
};
export default React.memo(LoadSpinner);
