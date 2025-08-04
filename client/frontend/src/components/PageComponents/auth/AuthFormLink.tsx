import { Link } from "react-router-dom";

type AuthFormLinkProps = {
  to: string;
  promptText: string;
  linkText: string;
};

export const AuthFormLink = ({ to, promptText, linkText }: AuthFormLinkProps) => {
  return (
    <div className="text-center text-sm">
      <span className="text-muted-foreground">{promptText} </span>
      <Link to={to} className="text-primary hover:underline font-medium">
        {linkText}
      </Link>
    </div>
  );
};