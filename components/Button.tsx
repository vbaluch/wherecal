import { MouseEventHandler, ReactChild } from "react";

export default function Button(props: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children?: ReactChild | ReactChild[];
}) {
  return (
    <button
      type="submit"
      onClick={props.onClick}
      disabled={props.disabled}
      className="group relative max-w-xl flex justify-center mx-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
    >
      {props.children}
    </button>
  );
}
