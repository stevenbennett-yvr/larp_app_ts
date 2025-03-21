import { useState, useEffect } from "react";
import {
  Aside,
  ScrollArea,
  Stack
} from "@mantine/core";
import { globals } from "../../../assets/globals";
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import MageCard from "../../../components/TatteredVeil/MageCard";

type CastAsideProps = {
  domainAwakenedList: Awakened[];
  currentUser: any;
};

const CastAside = ({ domainAwakenedList, currentUser }: CastAsideProps) => {
  const filteredAwakenedList = domainAwakenedList.filter(
    (character) => character.uid !== currentUser.uid && character.background.showPublic
  );

  const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
  useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])
  const height = globals.viewportHeightPx

  return (
    <>
      {showAsideBar ? (
        <Aside p="md" hiddenBreakpoint="sm" width={{ xs: 400 }} style={{ zIndex: 0 }}>
        <ScrollArea h={height - 100}>
        <Stack>
        {filteredAwakenedList.map((character) => {
          return(
          <MageCard awakened={character} key={character.id} />
        )})}
        </Stack>
        </ScrollArea>
        </Aside>
      ) : (
        <></>
      )}
  </>
  );
};

export default CastAside;
