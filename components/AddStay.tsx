import {
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  ChangeEvent,
} from "react";
import { useCombobox } from "downshift";
import { supabase } from "../utils/supabaseClient";

import { Location } from "../types/Location";
import Button from "./Button";
import { locationSearch } from "../utils/locationSearch";
import { NewStay } from "../types/Stay";

export default function AddStay(props: {
  setStaysChanged: Dispatch<SetStateAction<Date>>;
}) {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const items: Location[] = [];
  const [inputItems, setInputItems] = useState<Location[]>(items);
  const itemToString = (item: Location | null) => (item ? item.name : "");
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    itemToString,
    onInputValueChange: async ({ inputValue }) => {
      if (!inputValue) {
        return;
      }
      const locationSearchResult = await locationSearch(inputValue);
      setInputItems(locationSearchResult || []);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setSelectedLocation(selectedItem);
      }
    },
  });

  const onAddButtonClick = async (e: MouseEvent) => {
    e.preventDefault();
    if (!(fromDate && toDate && selectedLocation && toDate >= fromDate)) {
      alert(
        "All fields are mandatory; end date has to be later or the same as start date."
      );
      return;
    }
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("trying to add stay when not authenticated");
    }
    const newStay: NewStay = {
      user_profile_id: user.id,
      from_date: fromDate,
      to_date: toDate,
      location: selectedLocation.id,
    };
    await supabase.from("stays").insert(newStay);
    props.setStaysChanged(new Date());
  };

  return (
    <div className="mt-4 min-w-full sm:w-s flex justify-center items-center">
      <div className="relative min-w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow bg-zinc-800">
          <form
            className="px-6 py-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8"
            action="#"
          >
            <h3 className="text-xl font-medium text-white">Add a stay</h3>
            <div className="flex justify-between">
              <div className="flex flex-col items-start">
                <label className="text-white" htmlFor="from-date">
                  From:
                </label>
                <input
                  className="bg-zinc-700 text-white"
                  type="date"
                  id="from-date"
                  value={fromDate}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    setFromDate(e.target.value)
                  }
                ></input>
                <label className="text-white" htmlFor="to-date">
                  To:
                </label>
                <input
                  className="bg-zinc-700 text-white"
                  type="date"
                  id="to-date"
                  value={toDate}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    setToDate(e.target.value)
                  }
                ></input>
                <div>
                  <label className="text-white" {...getLabelProps()}>
                    Select a location:
                  </label>
                  <div {...getComboboxProps()}>
                    <input
                      className="bg-zinc-700 text-white"
                      {...getInputProps()}
                    />
                    <button
                      type="button"
                      {...getToggleButtonProps()}
                      aria-label="toggle menu"
                    >
                      &#8595;
                    </button>
                  </div>
                  <ul {...getMenuProps()}>
                    {isOpen &&
                      inputItems.map((item, index) => (
                        <li
                          className={`text-white ${
                            highlightedIndex === index ? "bg-zinc-500" : ""
                          }`}
                          key={item.id}
                          {...getItemProps({ item, index })}
                        >
                          {item.full_name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <Button onClick={onAddButtonClick}>Add</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
