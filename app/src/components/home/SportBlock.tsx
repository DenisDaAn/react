import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { LeagueTable } from "./LeagueTable";

export const SportBlock = memo(function SportBlock({ sport }: any) {
  if (!sport?.leagues?.length) return null;

  return (
    <Box sx={{ width: "100%", borderBottom: "2px solid #2b2b2b" }}>
      

      {sport.leagues.map((league: any, i: number) => (
        <LeagueTable key={`${league.league}-${i}`} league={league} />
      ))}
    </Box>
  );
});
