import Button from "@/components/ui/Button";

const SignupButton = () => {
  return (
    <Button
      href="/signup"
      size="sm"
      aria-label="Sign up for FocusPond"
      className="border border-accent-button font-sora"
    >
      Get started
    </Button>
  );
};

export default SignupButton;
