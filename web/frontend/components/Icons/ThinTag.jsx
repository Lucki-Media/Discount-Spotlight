import React from "react";

function ThinTag(props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        id="discount"
        width={props.icon_style.size}
        height={props.icon_style.size}
      >
        <g fill={props.icon_style.color}>
          <path d="M28 53.1c-1.3 0-2.5-.5-3.4-1.4L11.3 38.4c-1.9-1.9-1.9-4.9 0-6.8l17.8-17.8c1.6-1.6 4.5-2.8 6.7-2.8h11.4c2.6 0 4.8 2.2 4.8 4.8v11.4c0 2.2-1.2 5.1-2.8 6.7L31.4 51.7c-.9.9-2.1 1.4-3.4 1.4zM35.8 14c-1.4 0-3.6.9-4.6 1.9L13.4 33.7c-.7.7-.7 1.8 0 2.5l13.3 13.3c.7.7 1.9.7 2.5 0L47 31.7c1-1 1.9-3.1 1.9-4.6V15.7c0-1-.8-1.8-1.8-1.8H35.8v.1z"></path>
          <path d="M40 28.9c-3.2 0-5.9-2.6-5.9-5.9 0-3.2 2.6-5.9 5.9-5.9 3.2 0 5.9 2.6 5.9 5.9 0 3.2-2.6 5.9-5.9 5.9zm0-9c-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1z"></path>
        </g>
      </svg>
    </div>
  );
}

export default ThinTag;
