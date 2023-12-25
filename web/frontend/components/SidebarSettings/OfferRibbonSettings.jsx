import { RadioButton, Text } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import TooltipSlider from "rc-slider";
import "rc-slider/assets/index.css";
import "../../css/settings.css";
import { ColorPlate } from "../colorPlate";

function OfferRibbonSettings(props) {
  const [ribbonPosition, setRibbonPosition] = useState(
    props.json_style_data.offer_ribbon_settings.position
  );
  const [ribbonOffset, setRibbonOffset] = useState(
    props.json_style_data.offer_ribbon_settings.offset
  );
  const [ribbonFontSize, setRibbonFontSize] = useState(
    props.json_style_data.offer_ribbon_settings.fontSize
  );
  const [ribbonTextColor, setRibbonTextColor] = useState(
    props.json_style_data.offer_ribbon_settings.textColor
  );
  const [ribbonBGColor, setRibbonBGColor] = useState(
    props.json_style_data.offer_ribbon_settings.bgColor
  );
  // HANDLE FUNCTIONS START
  const handleRibbonPosition = useCallback((newValue) => {
    setRibbonPosition(newValue.target.value);
    [];
  });

  const handleRibbonOffset = (val) => {
    setRibbonOffset(val);
  };

  const handleRibbonFontSize = (val) => {
    setRibbonFontSize(val);
  };

  const handleRibbonTextColor = useCallback(
    (value) => setRibbonTextColor(value),
    []
  );

  const handleRibbonBGColor = useCallback(
    (value) => setRibbonBGColor(value),
    []
  );
  // HANDLE FUNCTIONS END

  //  RENDER SETTINGS RELATED TO POSITION
  const renderPositionSettings = () => (
    <div>
      {/* RIBBON POSITION RADIO BUTTON */}
      <div>
        <Text>Position</Text>
        <div className="radiio_group">
          <div className="radio_div">
            <input
              type="radio"
              name="position"
              id="positionTop"
              checked={ribbonPosition === "1"}
              onChange={handleRibbonPosition}
              value="1"
            />
            <label htmlFor="positionTop">Top</label>
          </div>
          <div className="radio_div">
            <input
              type="radio"
              name="position"
              id="positionBottom"
              checked={ribbonPosition === "2"}
              onChange={handleRibbonPosition}
              value="2"
            />
            <label htmlFor="positionBottom">Bottom</label>
          </div>
        </div>
      </div>

      {/* RIBBON OFFSET SETTING */}
      <div className="style__wrapper_div">
        <Text>Offset</Text>
        <Text variant="headingSm" as="h6">
          {ribbonOffset}px
        </Text>
        <div className="settings_range_slider">
          <TooltipSlider
            value={ribbonOffset}
            min={0}
            max={100}
            onChange={handleRibbonOffset}
          />
        </div>
      </div>
    </div>
  );

  //  RENDER SETTINGS RELATED TO SIZE
  const renderSizeSettings = () => (
    <div>
      {/* RIBBON FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text>Ribbon Font Size</Text>
        <Text variant="headingSm" as="h6">
          {ribbonFontSize}px
        </Text>
        <div className="settings_range_slider">
          <TooltipSlider
            value={ribbonFontSize}
            min={8}
            max={20}
            onChange={handleRibbonFontSize}
          />
        </div>
      </div>
    </div>
  );

  //  RENDER SETTINGS RELATED TO COLOR
  const renderColorSettings = () => (
    <div>
      {/* FONT COLOR FOR LABEL */}
      <div className="style__wrapper_div">
        <Text>Color</Text>
        <div className="color_column_container">
          <ColorPlate
            defaultColor={ribbonTextColor}
            onChildResult={handleRibbonTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Icon"
          />
          <ColorPlate
            defaultColor={ribbonBGColor}
            onChildResult={handleRibbonBGColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Label"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderPositionSettings()}
      {renderSizeSettings()}
      {renderColorSettings()}
    </div>
  );
}

export default OfferRibbonSettings;
