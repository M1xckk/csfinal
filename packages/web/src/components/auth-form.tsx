import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Button } from "./ui/button";

export function AuthForm() {
  const { login, register } = useKindeAuth();

  return (
    <div>
      <div className="flex items-center mt-8 gap-12">
        <Button onClick={() => register()} type="button">
          Register
        </Button>
        <Button onClick={() => login()} type="button">
          Log In
        </Button>
      </div>
    </div>
  );
}
