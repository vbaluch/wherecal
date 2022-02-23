import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { UserStay } from "../types/Stay";
import { getFriendsStays } from "../utils/staysService";

const DynamicStaysMap = dynamic(() => import("./StaysMap"));

export default function FriendsStays() {
  const [stays, setStays] = useState<UserStay[] | null>([]);

  useEffect(() => {
    async function updateStays() {
      const userStays = await getFriendsStays();
      setStays(userStays);
    }
    updateStays();
  }, []);

  return (
    <div>
      <DynamicStaysMap stays={stays} />
    </div>
  );
}
