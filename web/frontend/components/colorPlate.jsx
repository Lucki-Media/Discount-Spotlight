import React, { useState, useRef, useEffect } from "react";
// import { Button, ColorPicker, TextField } from '@shopify/polaris';
import "../css/settings.css";
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";

export function ColorPlate(props) {
  const [color, setColor] = useState(props.defaultColor);

  const { setSolid, setGradient } = useColorPicker(color, setColor);

  const [open, setOpen] = useState(false);
  const colorPickerContainerRef = useRef(null);

  const handleColorPickerChange = (val) => {
    setColor(val);
    props.onChildResult(val);
  };

  const handlePageClick = (event) => {
    if (
      colorPickerContainerRef.current &&
      !colorPickerContainerRef.current.contains(event.target) &&
      !event.target.closest(".color_picker_popup")
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handlePageClick);
    return () => {
      document.removeEventListener("mousedown", handlePageClick);
    };
  }, []);

  return (
    <>
      <div style={{ width: "50%" }}>
        <div className="color_picker_class">
          <div className="">
            <span
              style={{
                background: props.defaultColor,
                width: 40,
                height: 30,
                borderRadius: 3,
                display: "block",
                border: "1px solid #ccc",
              }}
              onClick={() => {
                setOpen(!open);
              }}
            ></span>
          </div>
          <span className="color_picker__code">{props.colorPlateTitle}</span>
        </div>
        {open ? (
          <div
            ref={colorPickerContainerRef}
            className={`color_picker_popup ${open ? "visible" : ""}`}
          >
            <ColorPicker
              value={color}
              onChange={handleColorPickerChange}
              hideColorTypeBtns={props.hideColorTypeBtns} // IT IS FOR SHOW GRADIENT OPTION ONLY TO BACKGROUND COLOR
              hideEyeDrop={true}
              hideAdvancedSliders={true}
              hideColorGuide={true}
              hideGradientType={true}
              hideGradientAngle={true}
              hideGradientStop={true}
              hideGradientControls={true}
            />
            {/* <ColorPicker
                            onChange={handleColorPickerChange}
                            color={ColorHSVA}
                            allowAlpha={true}
                        />
                        <div>
                            <div className="color_picker__textfieldd">
                                <TextField
                                    value={colorRGBA}
                                    onChange={handlecolorTextField}
                                    autoComplete="off"
                                />
                            </div>
                        </div> */}
          </div>
        ) : null}
      </div>
    </>
  );
}
