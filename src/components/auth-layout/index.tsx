type AuthLayoutProps = {
  title: string;
  image: string;
  children: React.ReactNode;
};

const AuthLayout = ({ title, image, children }: AuthLayoutProps) => {
  return (
   
    <div className="min-h-screen w-screen bg-linear-to-b from-rose-200 via-pink-100 to-purple-200 flex items-center justify-center p-6">

      {/* Content container */}
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full border border-black/20 rounded-3xl p-8 bg-transparent">

        {/* LEFT FORM SECTION */}
        <div className="w-full md:w-100 flex flex-col gap-6 text-black">

          {/* Page title */}
          <h2 className="text-4xl font-bold text-black">
            {title}
          </h2>

          {children}

        </div>

        {/* RIGHT — IMAGE */}
        <div className="hidden md:block w-112.5">
          <img
            src={image}
            alt="Auth visual"
            className="w-full h-auto object-contain rounded-3xl shadow-xl"
          />
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
