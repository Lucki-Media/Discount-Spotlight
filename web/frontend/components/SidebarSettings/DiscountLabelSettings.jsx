import React, { useCallback, useState } from 'react'
import { ColorPlate } from '../colorPlate';
import { TextField } from '@shopify/polaris';

function DiscountLabelSettings() {
  const [labelText, setLabelText] = useState("#FF0000");
  const [labelTextColor, setLabelTextColor] = useState("#FF0000");

  // LABEL CONTENT HANDLE FUNCTION START
  const handleLabelText = (val) => {
    setLabelText(val);
  };
  // LABEL CONTENT HANDLE FUNCTION END

  // COLOR SETTINGS HANDLE FUNCTION START 
  const handleLabelTextColor = useCallback(
    (value) => setLabelTextColor(value),
    []
  );
  // COLOR SETTINGS HANDLE FUNCTION END

  // 
  const renderContentSettings = () => (
    <div>
      {/* LABEL TEXT */}
      <div className="style__wrapper_div">
        <span className="display_setting_subtitle">Label Text</span>
        <div className="buy_now__textfield">
          <TextField
            label="Store name"
            value={labelText}
            onChange={handleLabelText}
            autoComplete="off"
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
        <span className="display_setting_subtitle">Reject Button</span>
        <div className="color_column_container">
          <ColorPlate
            defaultColor={labelTextColor}
            onChildResult={handleLabelTextColor}
            hideColorTypeBtns={true}
            colorPlateTitle="Text"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderContentSettings()}
      {/* {renderColorSettings()} */}
    </div>
  )
}

export default DiscountLabelSettings