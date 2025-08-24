import { SignUp } from "@clerk/nextjs";

export const runtime = "edge";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
