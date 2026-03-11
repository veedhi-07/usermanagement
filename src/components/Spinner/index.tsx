import { Spinner } from "flowbite-react";

const LoadSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="xl" aria-label="Loading users..." />
    </div>
  );
};
export default LoadSpinner;
