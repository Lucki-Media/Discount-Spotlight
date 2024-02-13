import React from "react";
import {
  Tag,
  Listbox,
  Combobox,
  LegacyStack,
  AutoSelection,
} from "@shopify/polaris";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

function DiscountCombobox(props) {
  //   console.log("discounts", props.discounts);
  const deselectedOptions = useMemo(() => props.discounts, []);
  // console.log(deselectedOptions);
  const [selectedOptions, setSelectedOptions] = useState(props.selectedOptions);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selectedOptions.includes(Number(selected))) {
        let again_selected = selectedOptions.filter(
          (option) => Number(option) !== Number(selected)
        );
        setSelectedOptions(again_selected);
      } else {
        if (selectedOptions.length < 3) {
          let new_selected = [...selectedOptions, Number(selected)];
          setSelectedOptions(new_selected);
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
    [selectedOptions, updateText]
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions]
  );

  const tagsMarkup =
    selectedOptions.length > 0 ? (
      <LegacyStack spacing="extraTight" alignment="center">
        {selectedOptions.map((selectedOption) => (
          // console.log(selectedOption, typeof selectedOption),
          <Tag
            key={`option-${Number(selectedOption)}`}
            onRemove={removeTag(Number(selectedOption))}
          >
            {
              deselectedOptions.find(
                (option) => Number(option.value) === Number(selectedOption)
              )?.label
            }
          </Tag>
        ))}
      </LegacyStack>
    ) : null;

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(value)}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

  // callback whenever selected option changes
  useEffect(() => {
    props.discountCallback(props.product_id, selectedOptions);
  }, [selectedOptions]);

  return (
    <>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            onChange={updateText}
            label="Search discounts"
            labelHidden
            value={inputValue}
            placeholder="Search discounts"
            verticalContent={tagsMarkup}
            autoComplete="off"
            clearButton
            onClearButtonClick={() => {
              setInputValue("");
            }}
          />
        }
      >
        {optionsMarkup ? (
          <Listbox
            autoSelection={AutoSelection.None}
            onSelect={updateSelection}
          >
            {optionsMarkup}
          </Listbox>
        ) : null}
      </Combobox>
    </>
  );
}

export default DiscountCombobox;
