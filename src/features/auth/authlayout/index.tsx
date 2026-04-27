import GridShape from "../../../components/common/gridshape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../../components/common/theme/theme-toggler-two/index";
import PageMeta from "../../../components/common/page-meta/index";
import { useLocation } from "react-router";
import SignInForm from "../components/signinform";
import SignUpForm from "../components/signupform";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isSignIn = pathname.includes("signin");

  return (
    <>
      <PageMeta
        title={isSignIn ? "Sign In" : "Sign Up"}
        description="Auth Page"
      />
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
            <div className="relative flex items-center justify-center z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link to="/" className="block mb-4">
                  <img
                    width={231}
                    height={48}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Free and Open-Source Tailwind CSS Admin Dashboard Template
                </p>
              </div>
            </div>
          </div>
          <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    </>
  );
}
