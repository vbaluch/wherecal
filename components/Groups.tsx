import React, { useState, useEffect } from "react";

import { UserGroup } from "../types/Group";
import { getAllUserGroups } from "../utils/groupsService";
import GroupCard from "./GroupCard";

export default function Groups() {
  const [groups, setGroups] = useState<UserGroup[] | null>([]);
  const [groupsChanged, setGroupsChanged] = useState(new Date());

  useEffect(() => {
    async function updateGroups() {
      const allUserGroups = await getAllUserGroups();
      setGroups(allUserGroups);
    }
    updateGroups();
  }, [groupsChanged]);

  const allGroups = groups?.map((group) => (
    <GroupCard
      key={group.id}
      group={group}
      setGroupsChanged={setGroupsChanged}
    />
  ));

  return <div>{allGroups}</div>;
}
