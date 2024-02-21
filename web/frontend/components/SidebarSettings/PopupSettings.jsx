import React, { useCallback, useEffect, useState } from "react";
import { ColorPlate } from "../colorPlate";
import "../../css/settings.css";
import { RangeSlider, Text, TextField } from "@shopify/polaris";

function PopupSettings(props) {
  const [titleText, setTitleText] = useState(
    props.json_style_data.popup_modal_settings.text.titleText
  );
  const [titleFontSize, setTitleFontSize] = useState(
    props.json_style_data.popup_modal_settings.fontSize.titleFontSize
  );
  const [discountCodeFontSize, setDiscountCodeFontSize] = useState(
    props.json_style_data.popup_modal_settings.fontSize.discountCodeFontSize
  );
  const [discountTaCFontSize, setDiscountTaCFontSize] = useState(
    props.json_style_data.popup_modal_settings.fontSize.discountTaCFontSize
  );
  const [titleTextColor, setTitleTextColor] = useState(
    props.json_style_data.popup_modal_settings.color.titleTextColor
  );
  const [titleBGColor, setTitleBGColor] = useState(
    props.json_style_data.popup_modal_settings.color.titleBGColor
  );
  const [discountCodeTextColor, setDiscountCodeTextColor] = useState(
    props.json_style_data.popup_modal_settings.color.discountCodeTextColor
  );
  const [discountCodeBGColor, setDiscountCodeBGColor] = useState(
    props.json_style_data.popup_modal_settings.color.discountCodeBGColor
  );
  const [discountTaCTextColor, setDiscountTaCTextColor] = useState(
    props.json_style_data.popup_modal_settings.color.discountTaCTextColor
  );
  const [bGContentColor, setBGContentColor] = useState(
    props.json_style_data.popup_modal_settings.color.bGContentColor
  );
  const [discountCodeBorderColor, setDiscountCodeBorderColor] = useState(
    props.json_style_data.popup_modal_settings.color.discountCodeBorderColor
  );
  const [cancleButtonColor, setCancleButtonColor] = useState(
    props.json_style_data.popup_modal_settings.color.cancleButtonColor
  );

  // VARIABLE THAT TRANSFER DATA FROM ONE FILE TO ANOTHER
  var transfer_data = {
    discount_label_settings: props.json_style_data.discount_label_settings,
    popup_modal_settings: {
      text: {
        titleText: titleText,
      },
      fontSize: {
        titleFontSize: titleFontSize,
        discountCodeFontSize: discountCodeFontSize,
        discountTaCFontSize: discountTaCFontSize,
      },
      color: {
        titleTextColor: titleTextColor,
        discountCodeTextColor: discountCodeTextColor,
        discountTaCTextColor: discountTaCTextColor,
        cancleButtonColor: cancleButtonColor,
        discountCodeBorderColor: discountCodeBorderColor,
        discountCodeBGColor: discountCodeBGColor,
        bGContentColor: bGContentColor,
        titleBGColor: titleBGColor,
      },
    },
    offer_ribbon_settings: props.json_style_data.offer_ribbon_settings,
  };
  // CALLBACK FUNCTION TO SEND PROPS START
  useEffect(() => {
    callbackFunction();
  }, [
    // IT WILL SEND LATEST DATA OF ALL STATES
    titleText,
    titleFontSize,
    discountCodeFontSize,
    discountTaCFontSize,
    titleTextColor,
    discountCodeTextColor,
    discountTaCTextColor,
    cancleButtonColor,
    discountCodeBorderColor,
    discountCodeBGColor,
    bGContentColor,
    titleBGColor,
  ]);

  const callbackFunction = useCallback(() => {
    props.dataCallback(transfer_data);
  }, [transfer_data]);
  // CALLBACK FUNCTION TO SEND PROPS END

  // HANDLE FUNCTION START
  const handleTitleText = (val) => {
    setTitleText(val);
  };

  const handleTitleFontSize = (val) => {
    setTitleFontSize(val);
  };

  const handleDiscountCodeFontSize = (val) => {
    setDiscountCodeFontSize(val);
  };

  const handleDisccountTaCFontSize = (val) => {
    setDiscountTaCFontSize(val);
  };

  const handleTitleTextColor = useCallback(
    (value) => setTitleTextColor(value),
    []
  );

  const handleTitleBGColor = useCallback((value) => setTitleBGColor(value), []);

  const handleDiscountCodeTextColor = useCallback(
    (value) => setDiscountCodeTextColor(value),
    []
  );

  const handleDiscountCodeBGColor = useCallback(
    (value) => setDiscountCodeBGColor(value),
    []
  );

  const handleDiscountTaCTextColor = useCallback(
    (value) => setDiscountTaCTextColor(value),
    []
  );

  const handleBGContentColor = useCallback(
    (value) => setBGContentColor(value),
    []
  );

  const handleDiscountCodeBorderColor = useCallback(
    (value) => setDiscountCodeBorderColor(value),
    []
  );

  const handleCancleButtonColor = useCallback(
    (value) => setCancleButtonColor(value),
    []
  );
  // HANDLE FUNCTION END

  //  RENDER SETTINGS RELATED TO TEXT
  const renderContentSettings = () => (
    <div>
      {/* LABEL TEXT */}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Title Text
        </Text>
        <div className="input_field_div">
          <TextField
            label="Title Text"
            labelHidden
            name="labelText"
            id="labelText"
            value={titleText}
            onChange={handleTitleText}
            placeholder="Example: Available Coupons"
            maxLength={30}
            showCharacterCount
            autoComplete="off"
            error={
              titleText === "" || titleText.length > 30
                ? "Enter Valid Title Text"
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
      {/* TITLE FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Title Font Size
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${titleFontSize}px`}
            min={12}
            max={40}
            value={titleFontSize}
            onChange={handleTitleFontSize}
          />
        </div>
      </div>

      {/* DISCOUNT CODE FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Discount Font Size
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${discountCodeFontSize}px`}
            min={8}
            max={25}
            value={discountCodeFontSize}
            onChange={handleDiscountCodeFontSize}
          />
        </div>
      </div>

      {/* TERMS & CONDITIONS FONT SIZE*/}
      <div className="style__wrapper_div">
        <Text as="p" fontWeight="semibold">
          Terms & Conditions Font Size
        </Text>
        <div className="input_field_div">
          <RangeSlider
            output
            label={`${discountTaCFontSize}px`}
            min={8}
            max={25}
            value={discountTaCFontSize}
            onChange={handleDisccountTaCFontSize}
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
            defaultColor={titleTextColor}
            onChildResult={handleTitleTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Title Text"
          />
          <ColorPlate
            defaultColor={titleBGColor}
            onChildResult={handleTitleBGColor}
            hideColorTypeBtns={false}
            colorPlateTitle="Title Background"
          />
        </div>

        <div className="color_column_container">
          <ColorPlate
            defaultColor={discountCodeTextColor}
            onChildResult={handleDiscountCodeTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Discount Text"
          />
          <ColorPlate
            defaultColor={discountCodeBGColor}
            onChildResult={handleDiscountCodeBGColor}
            hideColorTypeBtns={false}
            colorPlateTitle="Discount Background"
          />
        </div>

        <div className="color_column_container">
          <ColorPlate
            defaultColor={discountTaCTextColor}
            onChildResult={handleDiscountTaCTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="T&C Text"
          />
          <ColorPlate
            defaultColor={bGContentColor}
            onChildResult={handleBGContentColor}
            hideColorTypeBtns={false}
            colorPlateTitle="Content Background"
          />
        </div>

        <div className="color_column_container">
          <ColorPlate
            defaultColor={discountCodeBorderColor}
            onChildResult={handleDiscountCodeBorderColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Discount Border"
          />
          <ColorPlate
            defaultColor={cancleButtonColor}
            onChildResult={handleCancleButtonColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Cancel Button"
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

export default PopupSettings;
