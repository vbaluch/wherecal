import { Dispatch, SetStateAction, MouseEvent } from "react";

import { UserGroup } from "../types/Group";
import { supabase } from "../utils/supabaseClient";
import { joinGroup, leaveGroup } from "../utils/groupsService";
import Button from "./Button";

export default function GroupCard(props: {
  group: UserGroup;
  setGroupsChanged: Dispatch<SetStateAction<Date>>;
}) {
  const onJoinButtonClick = async (e: MouseEvent) => {
    e.preventDefault();
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("trying to join group when not authenticated");
    }
    await joinGroup(props.group);
    props.setGroupsChanged(new Date());
  };

  const onLeaveButtonClick = async (e: MouseEvent) => {
    e.preventDefault();
    const user = supabase.auth.user();
    if (!user) {
      throw new Error("trying to leave group when not authenticated");
    }
    await leaveGroup(props.group);
    props.setGroupsChanged(new Date());
  };

  return (
    <div className="flex flex-col items-start rounded-lg border shadow-md border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
      <div className="px-6 py-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8">
        <h2 className="truncate mb-2 text-xl font-bold tracking-tight text-white">
          {props.group.name}
        </h2>
        {props.group.member ? (
          <Button onClick={onLeaveButtonClick}>Leave</Button>
        ) : (
          <Button onClick={onJoinButtonClick}>Join</Button>
        )}
      </div>
    </div>
  );
}
