/* eslint-disable @next/next/no-img-element */

import { Dispatch, SetStateAction, useState, MouseEvent } from "react";

import { supabase } from "../utils/supabaseClient";
import { UserStay } from "../types/Stay";

export default function StayCard(props: {
  stay: UserStay;
  setStaysChanged: Dispatch<SetStateAction<Date>>;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onDeleteLinkClick = async (e: MouseEvent) => {
    e.preventDefault();
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("trying to delete stay when not authenticated");
    }
    await supabase.from("stays").delete().match({ id: props.stay.id });
    props.setStaysChanged(new Date());
  };

  return (
    <div className="mt-4 min-w-full sm:w-s flex flex-col flex-wrap items-start rounded-lg border shadow-md border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
      <div className="max-h-64 overflow-hidden">
        {props.stay.location.picture && (
          <img
            className="rounded-t-lg"
            src={`${props.stay.location.picture.unsplash_url_raw}&h=600&w=800&dpr=2"`}
            alt={props.stay.location.full_name}
          />
        )}
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="truncate max-w-xs	flex flex-col justify-between p-4 leading-normal">
          <div className="truncate mb-2 text-xl font-bold tracking-tight text-white">
            {props.stay.location.name}
          </div>
          <div className="mb-3 font-normal text-zinc-400">
            {props.stay.from_date} – {props.stay.to_date}
          </div>
        </div>
        <button
          id="dropdownButton"
          onClick={() => setDropdownOpen(true)}
          className={`${
            dropdownOpen ? "hidden" : "block"
          } flex-none text-zinc-400 hover:bg-zinc-700 rounded-lg text-sm p-1.5`}
          type="button"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </button>
        <div
          id="dropdown"
          className={`${
            dropdownOpen ? "block" : "hidden"
          } z-10 w-24 text-base list-none rounded divide-y divide-zinc-100 shadow bg-zinc-700`}
        >
          <ul className="py-1" aria-labelledby="dropdownButton">
            <li>
              <a
                onClick={onDeleteLinkClick}
                className="block py-2 px-4 text-sm hover:bg-zinc-600 text-red-500 hover:text-red-300"
              >
                Delete
              </a>
            </li>
            <li>
              <a
                className="block py-2 px-4 text-sm hover:bg-zinc-600 text-zinc-200 hover:text-white"
                onClick={() => setDropdownOpen(false)}
              >
                Close
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
