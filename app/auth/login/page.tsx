import { titleFont } from "@/config/fonts";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 sm:px-0">
      <div className="w-full max-w-112.5 flex flex-col fade-in">
        <h1
          className={`${titleFont.className} text-4xl mb-10 text-center sm:text-left`}
        >
          Ingresar
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}
