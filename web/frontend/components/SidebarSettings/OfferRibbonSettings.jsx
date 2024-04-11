import {
  RadioButton,
  RangeSlider,
  Text,
  InlineStack,
  Card,
  Button,
  Badge,
  TextField,
  Modal,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import "../../css/settings.css";
import { ColorPlate } from "../colorPlate";

function OfferRibbonSettings(props) {
  const [ribbonEnable, setRibbonEnabled] = useState(
    props.json_style_data.offer_ribbon_settings.enable
  );
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
  const [targetCssClasses, setTargetCssClasses] = useState(
    props.json_style_data.offer_ribbon_settings.targetCssClasses
  );
  const [activeModal, setActiveModal] = useState(false);

  // VARIABLE THAT TRANSFER DATA FROM ONE FILE TO ANOTHER
  var transfer_data = {
    discount_label_settings: props.json_style_data.discount_label_settings,
    popup_modal_settings: props.json_style_data.popup_modal_settings,
    offer_ribbon_settings: {
      enable: ribbonEnable,
      fontSize: ribbonFontSize,
      textColor: ribbonTextColor,
      bgColor: ribbonBGColor,
      position: ribbonPosition,
      offset: ribbonOffset,
      targetCssClasses: targetCssClasses,
    },
  };
  // CALLBACK FUNCTION TO SEND PROPS START
  useEffect(() => {
    callbackFunction();
  }, [
    // IT WILL SEND LATEST DATA OF ALL STATES
    ribbonEnable,
    ribbonFontSize,
    ribbonTextColor,
    ribbonBGColor,
    ribbonPosition,
    ribbonOffset,
    targetCssClasses,
  ]);

  const callbackFunction = useCallback(() => {
    props.dataCallback(transfer_data);
  }, [transfer_data]);
  // CALLBACK FUNCTION TO SEND PROPS END

  // HANDLE FUNCTIONS START
  const handleToggle = useCallback(
    () => setRibbonEnabled((enabled) => !enabled),
    []
  );

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

  const handleTargetCssClasses = (val) => {
    // FORMAT USER ENTERED DATA INTO VALID STRING
    const jsonString = JSON.stringify(val);
    const formattedString = jsonString
      .replace(/\\n/g, "")
      .replace(/\n/g, "")
      .replace(/, /g, ", ")
      .replace(/['"]/g, "");
    // console.log(formattedString);
    setTargetCssClasses(formattedString);
  };

  const handleChangeModal = useCallback(
    () => setActiveModal(!activeModal),
    [activeModal]
  );
  // HANDLE FUNCTIONS END

  //  RENDER SETTINGS RELATED TO TOGGLE (ENABLE/DISABLE)
  const renderToggleSettings = () => (
    <div>
      {/* RIBBON SHOW TOGGLE BUTTON */}
      <div className="style__wrapper_div">
        <Card padding="400">
          <InlineStack
            gap="800"
            align="space-between"
            blockAlign="center"
            wrap={false}
          >
            <Text as="p" variant="headingMd" fontWeight="semibold">
              Do you want show Offer Ribbon on Product list? {""}
              <Badge
                progress="complete"
                tone={ribbonEnable ? "success" : undefined}
              >
                {ribbonEnable ? "Enabled" : "Disabled"}
              </Badge>
            </Text>
            <Button
              role="switch"
              id="offer-ribbon-toggle"
              ariaChecked={ribbonEnable ? "true" : "false"}
              onClick={handleToggle}
              variant={ribbonEnable ? undefined : "primary"}
            >
              {ribbonEnable ? "Disable" : "Enable"}
            </Button>
          </InlineStack>
        </Card>
      </div>
    </div>
  );

  //  RENDER SETTINGS RELATED TO POSITION
  const renderPositionSettings = () => (
    <div>
      {/* RIBBON POSITION RADIO BUTTON */}
      <div className="style__wrapper_div">
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

  //  RENDER SETTINGS RELATED TO LABEL
  const renderContentSettings = () => (
    <div>
      {/* CSS CLASS CONFIGURATION */}
      <div className="style__wrapper_div">
        <InlineStack
          align="space-between"
          gap="400"
          blockAlign="center"
          wrap={false}
        >
          <Text as="p" fontWeight="semibold">
            Target Classes
          </Text>
          <Button variant="plain" onClick={handleChangeModal}>
            View Video Reference
          </Button>
        </InlineStack>
        <div className="input_field_div">
          <TextField
            label="Target Classes"
            labelHidden
            name="targetCssClasses"
            id="targetCssClasses"
            value={targetCssClasses}
            onChange={handleTargetCssClasses}
            placeholder="Example: card__information, product-title"
            autoComplete="off"
            multiline={3}
            helpText={
              <>
                If the Offer Ribbon isn't displaying on your online store,
                please enter the class names of the product cards from your
                product grid.
                <br />
                You can enter multiple classes separated by commas.
                <br />
                If you still have any issue, Don't hesitate to contact us. We
                are always there for you. Contact us via Email :
                <a href="mailto:info.lmrequest@gmail.com" target="_blank">
                  {" "}
                  info.lmrequest@gmail.com
                </a>
              </>
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 15px" }}>
      {renderToggleSettings()}
      {renderPositionSettings()}
      {renderSizeSettings()}
      {renderColorSettings()}
      {renderContentSettings()}

      {/* TARGET CLASS TOOLTIP MODAL */}
      <Modal
        open={activeModal}
        onClose={handleChangeModal}
        title="How does it work?"
        size="large"
      >
        <Modal.Section>
          <video controls style={{ width: "100%" }}>
            <source
              src="https://luckistore.in/discount_spotlight/target-class-acknowledgement.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default OfferRibbonSettings;
