import Button from "@/components/ui/Button";

const SignupButton = () => {
  return (
    <Button
      href="/waitlist"
      size="sm"
      aria-label="Sign up for FocusPond"
      className="font-medium"
    >
      Get Early Access
    </Button>
  );
};

export default SignupButton;
