import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { EventRow } from "./EventRow";

export const LeagueTable = memo(function LeagueTable({ league }: any) {
  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: "1px solid #2b2b2b",
      }}
    >
      {/* Заголовок лиги */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "var(--color-bg-card)",
          px: 3,
          py: 1.2,
          borderBottom: "1px solid #333",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "var(--color-accent)",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {league.league}
        </Typography>
      </Box>

  

      {/* События */}
      {league.events.map((event: any, index: number) => (
        <EventRow key={event.id} event={event} index={index} />
      ))}
    </Box>
  );
});
