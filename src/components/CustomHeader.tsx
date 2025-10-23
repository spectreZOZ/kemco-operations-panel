import { ChevronsLeft, Plus } from "lucide-react";

import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function CustomHeader({
  title,
  buttonText,
  buttonLink,
  isButtonDisabled,
  clickableButton,
  buttonComponent,
  navigateBack = false,
  message,
}: {
  title: string;
  buttonText?: string;
  buttonLink?: string;
  isButtonDisabled?: boolean;
  navigateBack?: boolean;
  message?: string;
  buttonComponent?: React.ReactNode;
  clickableButton?: {
    text: string;
    icon: string;
    disabled?: boolean;
    onClick?: () => void;
  };
}) {
  const router = useRouter();
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row space-y-16 w-full sm:space-y-0 flex-1 items-center justify-between ">
        <div className="flex flex-1 items-center gap-8 w-fit">
          {navigateBack && (
            <div onClick={() => router.back()} className="cursor-pointer">
              <ChevronsLeft />
            </div>
          )}

          <motion.span
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
          >
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </motion.span>
        </div>

        <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            {clickableButton && (
              <Button
                className="text-lg"
                variant="default"
                color="secondary"
                onClick={clickableButton.onClick}
                disabled={clickableButton.disabled}
              >
                {clickableButton.icon}
                {clickableButton.text}
              </Button>
            )}

            {buttonComponent && buttonComponent}

            {buttonText && (
              <Button
                variant="default"
                color="secondary"
                disabled={isButtonDisabled}
                onClick={() => {
                  if (buttonLink) {
                    router.push(buttonLink);
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                {buttonText}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
      {message && <p color={"text.secondary"}>{message}</p>}
    </div>
  );
}

export default CustomHeader;
