import React from "react";

function SolidPercentageTag(props) {
  return (
    <div style={{height:props.icon_style.size}}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.icon_style.size}
        height={props.icon_style.size}
        viewBox="0 0 8.467 8.467"
        id="discount"
      >
        <path
          d="M 15.953125 1.0039062 A 1.0001 1.0001 0 0 0 15.132812 1.5058594 L 13.080078 5.1015625 L 9.5 3.0117188 A 1.0001 1.0001 0 0 0 7.9941406 3.8828125 L 8.0175781 8.0175781 L 3.875 8.0019531 A 1.0001 1.0001 0 0 0 3.0117188 9.5078125 L 5.09375 13.080078 L 1.5058594 15.132812 A 1.0001 1.0001 0 0 0 1.5058594 16.867188 L 5.09375 18.919922 L 3.0117188 22.492188 A 1.0001 1.0001 0 0 0 3.875 23.998047 L 8.0175781 23.984375 L 7.9941406 28.117188 A 1.0001 1.0001 0 0 0 9.5 28.988281 L 13.080078 26.90625 L 15.132812 30.494141 A 1.0001 1.0001 0 0 0 16.867188 30.494141 L 18.912109 26.900391 L 22.492188 28.988281 A 1.0001 1.0001 0 0 0 23.998047 28.125 L 23.984375 23.984375 L 28.117188 23.998047 A 1.0001 1.0001 0 0 0 28.988281 22.5 L 26.90625 18.919922 L 30.494141 16.867188 A 1.0001 1.0001 0 0 0 30.494141 15.132812 L 26.90625 13.080078 L 28.988281 9.5 A 1.0001 1.0001 0 0 0 28.117188 8.0019531 L 23.984375 8.0175781 L 23.998047 3.8828125 A 1.0001 1.0001 0 0 0 22.492188 3.0117188 L 18.919922 5.09375 L 16.867188 1.5058594 A 1.0001 1.0001 0 0 0 15.953125 1.0039062 z M 13 8.9980469 C 14.64501 8.9980469 15.996094 10.358897 15.996094 12.003906 C 15.996094 13.648916 14.64501 15 13 15 C 11.35499 15 10.001953 13.648916 10.001953 12.003906 C 10.001953 10.358897 11.35499 8.9980469 13 8.9980469 z M 20.978516 9.9882812 A 1.0001001 1.0001001 0 0 1 21.710938 11.707031 L 11.707031 21.710938 A 1.0021986 1.0021986 0 1 1 10.291016 20.292969 L 20.292969 10.291016 A 1.0001001 1.0001001 0 0 1 20.978516 9.9882812 z M 19.001953 17 C 20.646963 17 21.998047 18.353037 21.998047 19.998047 C 21.998047 21.643057 20.646963 23.001953 19.001953 23.001953 C 17.356943 23.001953 15.996094 21.643057 15.996094 19.998047 C 15.996094 18.353037 17.356943 17 19.001953 17 z "
          color="#000"
          fontFamily="sans-serif"
          fontWeight="400"
          overflow="visible"
          transform="scale(.26458)"
          fill={props.icon_style.color}
          style={{
            lineHeight: "normal",
            fontVariantLigatures: "normal",
            fontVariantPosition: "normal",
            fontVariantCaps: "normal",
            fontVariantNumeric: "normal",
            fontVariantAlternates: "normal",
            fontFeatureSettings: "normal",
            textIndent: 0,
            textAlign: "start",
            textDecorationLine: "none",
            textDecorationStyle: "solid",
            textDecorationColor: "#000",
            textTransform: "none",
            textOrientation: "mixed",
            shapePadding: 0,
            isolation: "auto",
            mixBlendMode: "normal",
          }}
        ></path>
      </svg>
    </div>
  );
}

export default SolidPercentageTag;
