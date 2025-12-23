import { Box, Typography } from "@mui/material";
import { memo } from "react";

export const EventRow = memo(function EventRow({ event }: any) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 120px 120px",
        alignItems: "center",
        px: 3,
        py: 1.2,
        transition: "background 0.15s",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "var(--color-bg-card)",
        },
      }}
    >
      {/* Название события */}
      <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Typography
          variant="subtitle1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "var(--color-text)",
          }}
        >
          {event.team1 && event.team2
            ? `${event.team1} — ${event.team2}`
            : event.name}
        </Typography>
        <Typography variant="caption" sx={{ color: "var(--color-text-muted)" }}>
          {new Date(event.start_time).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          ·{" "}
          {new Date(event.start_time).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
          })}
        </Typography>
      </Box>

      {/* Коэффициенты */}
      {["win1", "draw", "win2"].map((k) => (
        <Box
          key={k}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "var(--color-text)",
              bgcolor: "rgba(255,255,255,0.05)",
              px: 1.2,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "background 0.2s, transform 0.1s",
              "&:hover": {
                bgcolor: "var(--color-accent)",
                color: "#101820",
                transform: "scale(1.05)",
              },
            }}
          >
            {event.factors?.[k] ?? "-"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
});
