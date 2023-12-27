import React, { useCallback, useEffect, useState } from "react";
import { ColorPlate } from "../colorPlate";
import TooltipSlider from "rc-slider";
import "rc-slider/assets/index.css";
import "../../css/settings.css";
import { Card, InlineGrid, Text } from "@shopify/polaris";
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
    color: "#5488C7",
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

  //  RENDER SETTINGS RELATED TO ICONS
  const renderIconSettings = () => (
    <div>
      <Text>Label Icon</Text>
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
                borderColor: tab.id == labelIcon ? "#5488c5" : "#E1E1E1",
                background: tab.id == labelIcon ? "#EAF4FF" : "transparent",
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
      {renderIconSettings()}
      {renderContentSettings()}
      {renderSizeSettings()}
      {renderColorSettings()}
    </div>
  );
}

export default DiscountLabelSettings;
