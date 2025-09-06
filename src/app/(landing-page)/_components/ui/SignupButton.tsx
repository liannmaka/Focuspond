import Button from "@/components/ui/Button";

const SignupButton = () => {
  return (
    <Button
      href="/signup"
      size="sm"
      aria-label="Sign up for FocusPond"
      className="font-medium"
    >
      Start for free
    </Button>
  );
};

export default SignupButton;
