import React, { useCallback, useEffect, useState } from "react";
import { ColorPlate } from "../colorPlate";
import "../../css/settings.css";
import { RangeSlider, Text, TextField } from "@shopify/polaris";
import ThinTag from "../Icons/ThinTag";
import SolidTag from "../Icons/SolidTag";
import ThinDoubleTags from "../Icons/ThinDoubleTags";
import SolidDoubleTags from "../Icons/SolidDoubleTags";
import ThinPercentageTag from "../Icons/ThinPercentageTag";
import SolidPercentageTag from "../Icons/SolidPercentageTag";

function DiscountLabelSettings(props) {
  const [labelIcon, setLabelIcon] = useState(
    props.json_style_data.discount_label_settings.icon_style.iconType
  );
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
        iconType: labelIcon,
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

  // ICONS ARRAY
  var icon_style = {
    iconType: "6",
    size: 25,
    color: "#000000",
  };
  const icons = [
    {
      id: "1",
      component: <ThinTag icon_style={icon_style} />,
    },
    {
      id: "2",
      component: <SolidTag icon_style={icon_style} />,
    },
    {
      id: "3",
      component: <ThinPercentageTag icon_style={icon_style} />,
    },
    {
      id: "4",
      component: <SolidPercentageTag icon_style={icon_style} />,
    },
    {
      id: "5",
      component: <ThinDoubleTags icon_style={icon_style} />,
    },
    {
      id: "6",
      component: <SolidDoubleTags icon_style={icon_style} />,
    },
    // Add other SVG icons
  ];

  // CALLBACK FUNCTION TO SEND PROPS START
  useEffect(() => {
    callbackFunction();
  }, [
    // IT WILL SEND LATEST DATA OF ALL STATES
    labelIcon,
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
    setLabelText(val);
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

  //  RENDER SETTINGS RELATED TO ICONS
  const renderIconSettings = () => (
    <div>
      <Text as="p" fontWeight="semibold">
        Label Icon
      </Text>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {icons.map((tab, index) => (
          <div
            key={tab.id}
            onClick={() => {
              setLabelIcon(tab.id);
            }}
            style={{
              cursor: "pointer",
              width: "42px",
              marginRight: "10px",
            }}
          >
            <div
              className="icon_type_radio"
              style={{
                borderColor: tab.id == labelIcon ? "#000000" : "#E1E1E1",
                background: tab.id == labelIcon ? "#EBEBEB" : "transparent",
              }}
            >
              {tab.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  //  RENDER SETTINGS RELATED TO LABEL
  const renderContentSettings = () => (
    <div>
      {/* LABEL TEXT */}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Label Text
        </Text>
        <div className="input_field_div">
          <TextField
            label="Label Text"
            labelHidden
            name="labelText"
            id="labelText"
            value={labelText}
            onChange={handleLabelText}
            placeholder="Example: Apply Coupons"
            maxLength={20}
            showCharacterCount
            autoComplete="off"
            error={
              labelText === "" || labelText.length > 20
                ? "Enter Valid Label Text"
                : ""
            }
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
        <Text as="p" fontWeight="semibold">
          Icon Size
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${labelIconSize}px`}
            min={20}
            max={40}
            value={labelIconSize}
            onChange={handleLabelIconSize}
          />
        </div>
      </div>

      {/* LABEL  FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Label Font Size
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${labelFontSize}px`}
            min={12}
            max={32}
            value={labelFontSize}
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
        <Text as="p" fontWeight="semibold">
          Color
        </Text>
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
      {renderIconSettings()}
      {renderContentSettings()}
      {renderSizeSettings()}
      {renderColorSettings()}
    </div>
  );
}

export default DiscountLabelSettings;
