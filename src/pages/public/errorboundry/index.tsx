import { Card } from "flowbite-react";

const ErrorBoundry = () => {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200 flex justify-center items-center">
        <Card className="w-180 h-60 bg-white! shadow-lg rounded-xl">
          <h6 className="text-2xl font-bold tracking-tight text-black flex justify-center">
            Error 404
          </h6>

          <p className="font-normal text-black flex justify-center">
            Oops Soemthing Went Wrong!!
          </p>
        </Card>
      </main>
    </div>
  );
};
export default ErrorBoundry;
