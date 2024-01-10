import React from "react";

export default function SolidTag(props) {
  return (
    <div style={{height:props.icon_style.size}}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.icon_style.size}
        height={props.icon_style.size}
        fill={props.icon_style.color}
        viewBox="0 0 448 512"
      >
        <path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
      </svg>
    </div>
  );
}
