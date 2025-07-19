import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Send, X } from "lucide-react";

interface EmailButtonProps {
  onSendEmail?: (email: string) => void;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export function EmailButton({ 
  onSendEmail, 
  buttonText = "Enviar Email", 
  placeholder = "Digite seu email",
  className 
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
          className={`flex-1 ${!isValid && email ? 'border-red-500 focus-visible:ring-red-500/50' : ''}`}
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
    <Button
      onClick={() => setIsOpen(true)}
      className={className}
    >
      <Mail className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
} 