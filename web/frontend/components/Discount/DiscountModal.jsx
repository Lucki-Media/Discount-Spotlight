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
import { ToastContainer, toast } from "react-toastify";

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
  // console.log(selected);
  const handleSelected = useCallback(
    (value) => {
      if (selected.length < 3) {
        setSelected(value);
      } else {
        const slicedArray = value.slice(-3);
        if (slicedArray.length !== 3) {
          setSelected(slicedArray);
        } else {
          toast.error("You can select up to 3 options only!", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
  
      updateText("");
    },
    [selected, updateText]
  );

  return (
    <Modal
      open={true}
      onClose={props.callbackClose}
      title={props.title}
      primaryAction={{
        content: props.primaryButtonText,
        onAction: () => {
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px auto",
              }}
            >
              <Spinner size="large" />
            </div>
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
                  onChange={handleSelected}
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
