import React, { useState, useEffect } from "react";

import { UserStay } from "../types/Stay";
import StayCard from "./StayCard";
import AddStay from "./AddStay";
import StaysMap from "./StaysMap";
import { getAllOwnStays } from "../utils/staysService";

export default function Authenticated() {
  const [stays, setStays] = useState<UserStay[] | null>([]);
  const [staysChanged, setStaysChanged] = useState(new Date());

  useEffect(() => {
    async function updateStays() {
      const userStays = await getAllOwnStays();
      setStays(userStays);
    }
    updateStays();
  }, [staysChanged]);

  const allStays = stays?.map((stay) => (
    <StayCard key={stay.id} stay={stay} setStaysChanged={setStaysChanged} />
  ));

  return (
    <div>
      <div className="flex flex-row justify-center sm:justify-start">
        <div className="ml-2 mr-1 w-full sm:w-6/12 md:w-4/12 flex flex-col flex-nowrap">
          <AddStay setStaysChanged={setStaysChanged} />
          {allStays}
        </div>
        <div className="ml-1 h-screen sticky top-0 w-0 sm:w-6/12 md:w-8/12 bg-zinc-500">
          <StaysMap stays={stays} />
        </div>
      </div>
    </div>
  );
}
