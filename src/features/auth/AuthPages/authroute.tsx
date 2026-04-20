import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../../features/auth/components/signinform/index";
import SignUpForm from "../../../features/auth/components/signupform/index";
import { useLocation } from "react-router";

export default function AuthRoute() {
  const { pathname } = useLocation();

  const isSignIn = pathname.includes("signin");

  return (
    <AuthLayout
      title={isSignIn ? "Sign In" : "Sign Up"}
      description="Auth Page"
    >
      {isSignIn ? <SignInForm /> : <SignUpForm />}
    </AuthLayout>
  );
}
