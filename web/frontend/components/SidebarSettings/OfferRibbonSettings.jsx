import { RadioButton, RangeSlider, Text } from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
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

  // VARIABLE THAT TRANSFER DATA FROM ONE FILE TO ANOTHER
  var transfer_data = {
    discount_label_settings: props.json_style_data.discount_label_settings,
    popup_modal_settings: props.json_style_data.popup_modal_settings,
    offer_ribbon_settings: {
      fontSize: ribbonFontSize,
      textColor: ribbonTextColor,
      bgColor: ribbonBGColor,
      position: ribbonPosition,
      offset: ribbonOffset,
    },
  };
  // CALLBACK FUNCTION TO SEND PROPS START
  useEffect(() => {
    callbackFunction();
  }, [
    // IT WILL SEND LATEST DATA OF ALL STATES
    ribbonFontSize,
    ribbonTextColor,
    ribbonBGColor,
    ribbonPosition,
    ribbonOffset,
  ]);

  const callbackFunction = useCallback(() => {
    props.dataCallback(transfer_data);
  }, [transfer_data]);
  // CALLBACK FUNCTION TO SEND PROPS END

  // HANDLE FUNCTIONS START
  const handleRibbonPosition = useCallback(
    (_, newValue) => setRibbonPosition(newValue),
    []
  );

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
        <Text as="p" fontWeight="semibold">
          Position
        </Text>
        <div className="radiio_group">
          <div className="radio_div">
            <RadioButton
              label="Top"
              checked={ribbonPosition === "top"}
              id="top"
              value="top"
              name="position"
              onChange={handleRibbonPosition}
            />
          </div>
          <div className="radio_div">
            <RadioButton
              label="Bottom"
              checked={ribbonPosition === "bottom"}
              id="bottom"
              value="bottom"
              name="position"
              onChange={handleRibbonPosition}
            />
          </div>
        </div>
      </div>

      {/* RIBBON OFFSET SETTING */}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Offset
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${ribbonOffset}px`}
            min={0}
            max={100}
            value={ribbonOffset}
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
        <Text as="p" fontWeight="semibold">
          Ribbon Font Size
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${ribbonFontSize}px`}
            min={8}
            max={20}
            value={ribbonFontSize}
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
        <Text as="p" fontWeight="semibold">
          Color
        </Text>
        <div className="color_column_container">
          <ColorPlate
            defaultColor={ribbonTextColor}
            onChildResult={handleRibbonTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Text"
          />
          <ColorPlate
            defaultColor={ribbonBGColor}
            onChildResult={handleRibbonBGColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Background"
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
