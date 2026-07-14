import "./Button.css";

export default function Button({ variant = "solid", className = "", children, ...rest }) {
  return (
    <button className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
