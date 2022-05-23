import "styles/ui/Button.scss";

export const Button = props => (
  <button
    {...props}
    style={{width: props.width, height: props.height, ...props.style}}
    className={`primary-button ${props.className}`}>
    {props.children}
  </button>
);
