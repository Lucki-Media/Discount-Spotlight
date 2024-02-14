import {
  Button,
  Modal,
  LegacyStack,
  TextContainer,
  Frame,
  TextField,
  Icon,
  OptionList,
  Spinner,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { SearchIcon } from "@shopify/polaris-icons";

function DiscountModal(props) {
  const [inputValue, setInputValue] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState(props.discounts);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(props.discounts);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = props.discounts.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [props.discounts]
  );

  return (
    <Modal
      open={true}
      onClose={props.callbackClose}
      title={props.title}
      primaryAction={{
        content: props.primaryButtonText,
        onAction: () => {
          console.log("first");
          props.returnSelected(selected);
          setModalLoading(true);
        },
      }}
      secondaryActions={[
        {
          content: "Close",
          onAction: props.callbackClose,
        },
      ]}
    >
      <div style={{ height: 430, minHeight: 430 }}>
        <Modal.Section>
          {modalLoading ? (
            <div style={{ display: "flex", justifyContent: "center"}}>
            <Spinner size="large" /></div>
          ) : (
            <LegacyStack vertical>
              {/* Search Field */}
              <LegacyStack.Item>
                <TextField
                  onChange={updateText}
                  label="Search discounts"
                  labelHidden
                  value={inputValue}
                  placeholder="Search to find discounts"
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => {
                    setInputValue("");
                  }}
                  prefix={<Icon source={SearchIcon} tone="base" />}
                />
              </LegacyStack.Item>

              {/* Discount Option List */}
              <LegacyStack.Item>
                <OptionList
                  onChange={setSelected}
                  sections={[
                    {
                      options: options,
                    },
                  ]}
                  selected={selected}
                  allowMultiple
                />
              </LegacyStack.Item>
            </LegacyStack>
          )}
        </Modal.Section>
      </div>
    </Modal>
  );
}

export default DiscountModal;
