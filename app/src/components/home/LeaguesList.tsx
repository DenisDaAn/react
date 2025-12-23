import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { SportBlock } from "./SportBlock";

export const LeaguesList = memo(function LeaguesList({ leagues }: any) {
  if (!leagues?.length) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--color-text-muted)",
          fontSize: "1.1rem",
        }}
      >
        Ничего не найдено
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        width: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--color-accent)",
          borderRadius: 5,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "var(--color-bg-drawer)",
        },
      }}
    >
      {leagues.map((sport: any, i: number) => (
        <SportBlock key={sport.alias || i} sport={sport} />
      ))}
    </Box>
  );
});
