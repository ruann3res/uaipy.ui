import { Mail, Send, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface EmailButtonProps {
  onSendEmail?: (email: string) => void;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledTooltip?: string;
}

export function EmailButton({
  onSendEmail,
  buttonText = "Enviar Email",
  placeholder = "Digite seu email",
  className,
  disabled = false,
  disabledTooltip = "Botão desabilitado",
}: EmailButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSend = () => {
    if (isValid && onSendEmail) {
      onSendEmail(email);
      setEmail("");
      setIsOpen(false);
      setIsValid(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setIsOpen(false);
    setIsValid(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      handleSend();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isOpen) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`flex-1 ${
            !isValid && email
              ? "border-red-500 focus-visible:ring-red-500/50"
              : ""
          }`}
          autoFocus
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!isValid}
          className="px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="px-3"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
        disabled={disabled}
      >
        <Mail className="w-4 h-4 mr-2" />
        {buttonText}
      </Button>
      {disabled && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {disabledTooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}
    </div>
  );
}
