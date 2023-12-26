import React, { useCallback, useEffect, useState } from "react";
import { ColorPlate } from "../colorPlate";
import TooltipSlider from "rc-slider";
import "rc-slider/assets/index.css";
import "../../css/settings.css";
import { Text } from "@shopify/polaris";

function DiscountLabelSettings(props) {
  const [labelText, setLabelText] = useState(
    props.json_style_data.discount_label_settings.label_style.text
  );
  const [labelFontSize, setLabelFontSize] = useState(
    props.json_style_data.discount_label_settings.label_style.fontSize
  );
  const [labelIconSize, setLabelIconSize] = useState(
    props.json_style_data.discount_label_settings.icon_style.size
  );
  const [labelTextColor, setLabelTextColor] = useState(
    props.json_style_data.discount_label_settings.label_style.color
  );
  const [labelIconColor, setLabelIconColor] = useState(
    props.json_style_data.discount_label_settings.icon_style.color
  );

  // VARIABLE THAT TRANSFER DATA FROM ONE FILE TO ANOTHER
  var transfer_data = {
    discount_label_settings: {
      icon_style: {
        iconType: "6",
        size: labelIconSize,
        color: labelIconColor,
      },
      label_style: {
        text: labelText,
        fontSize: labelFontSize,
        color: labelTextColor,
      },
    },
    popup_modal_settings: props.json_style_data.popup_modal_settings,
    offer_ribbon_settings: props.json_style_data.offer_ribbon_settings,
  };
  // CALLBACK FUNCTION TO SEND PROPS START
  useEffect(() => {
    callbackFunction();
  }, [
    // IT WILL SEND LATEST DATA OF ALL STATES
    labelText,
    labelFontSize,
    labelIconSize,
    labelTextColor,
    labelIconColor,
  ]);

  const callbackFunction = useCallback(() => {
    props.dataCallback(transfer_data);
  }, [transfer_data]);
  // CALLBACK FUNCTION TO SEND PROPS END

  // HANDLE FUNCTION START
  const handleLabelText = (val) => {
    setLabelText(val.target.value);
  };

  const handleLabelFontSize = (val) => {
    setLabelFontSize(val);
  };

  const handleLabelIconSize = (val) => {
    setLabelIconSize(val);
  };

  const handleLabelTextColor = useCallback(
    (value) => setLabelTextColor(value),
    []
  );

  const handleLabelIconColor = useCallback(
    (value) => setLabelIconColor(value),
    []
  );

  // HANDLE FUNCTION END

  //  RENDER SETTINGS RELATED TO LABEL
  const renderContentSettings = () => (
    <div>
      {/* LABEL TEXT */}
      <div className="style__wrapper_div">
        <Text>Label Text</Text>
        <div className="input_field_div">
          <input
            type="text"
            name="labelText"
            id="labelText"
            value={labelText}
            onChange={handleLabelText}
            className="settings_input_field"
          />
        </div>
      </div>
    </div>
  );

  //  RENDER SETTINGS RELATED TO SIZE
  const renderSizeSettings = () => (
    <div>
      {/* ICON  FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text>Icon Size</Text>
        <Text variant="headingSm" as="h6">
          {labelIconSize}px
        </Text>
        <div className="settings_range_slider">
          <TooltipSlider
            value={labelIconSize}
            min={20}
            max={40}
            onChange={handleLabelIconSize}
          />
        </div>
      </div>

      {/* LABEL  FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text>Label Font Size</Text>
        <Text variant="headingSm" as="h6">
          {labelFontSize}px
        </Text>
        <div className="settings_range_slider">
          <TooltipSlider
            value={labelFontSize}
            min={12}
            max={32}
            onChange={handleLabelFontSize}
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
            defaultColor={labelIconColor}
            onChildResult={handleLabelIconColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Icon"
          />
          <ColorPlate
            defaultColor={labelTextColor}
            onChildResult={handleLabelTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Label"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderContentSettings()}
      {renderSizeSettings()}
      {renderColorSettings()}
    </div>
  );
}

export default DiscountLabelSettings;
