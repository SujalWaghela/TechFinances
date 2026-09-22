import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useAuth } from "../../context/AuthContext";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  featureName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function AuthModal({
  isOpen,
  featureName,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { login, register } = useAuth();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setMode("login");
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setSubmitting(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const firstInput = dialog.querySelector<HTMLElement>("input");
      (firstInput ?? focusables[0] ?? dialog).focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => element.offsetParent !== null || element === document.activeElement);

      if (focusables.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
    setPassword("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const message = await login({ email, password });
    setSubmitting(false);

    if (message) {
      setError(message);
      return;
    }

    onSuccess();
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const message = await register({ name, email, password });
    setSubmitting(false);

    if (message) {
      setError(message);
      return;
    }

    onSuccess();
  }

  function handleOverlayClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    }
  }

  return (
    <div
      className="auth-modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="auth-modal-dialog auth-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <p className="eyebrow">
          {mode === "login" ? "Welcome back" : "New here"}
        </p>
        <h2 id={titleId}>{mode === "login" ? "Log in" : "Create account"}</h2>
        <p id={descriptionId} className="auth-subtitle">
          Log in to view your {featureName}.
        </p>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            {error && <p className="auth-error">{error}</p>}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={submitting}
            >
              {submitting ? "Logging in…" : "Log in to TechFinance"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            {error && <p className="auth-error">{error}</p>}

            <label className="auth-field">
              <span>Full name</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="auth-footer">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="auth-modal-switch"
                onClick={() => switchMode("register")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-modal-switch"
                onClick={() => switchMode("login")}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
