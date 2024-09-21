import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex w-full h-screen  items-center justify-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
