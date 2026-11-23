import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const SignupButton = () => {
  const t = useTranslations("common.cta");

  return (
    <Button
      href="/mood"
      size="sm"
      className="font-medium"
    >
      {t("startForFree")}
    </Button>
  );
};

export default SignupButton;
