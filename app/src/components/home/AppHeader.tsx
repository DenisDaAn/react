import { AppBar, Toolbar, Box, Typography, Paper, InputBase } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SearchIcon from "@mui/icons-material/Search";

export function AppHeader({ search, setSearch }: { search: string; setSearch: (val: string) => void }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "var(--color-bg-card)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        transition: "var(--transition-base)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SportsSoccerIcon sx={{ mr: 2, color: "var(--color-accent)" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            IBR Bet
          </Typography>
        </Box>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 0.5,
            borderRadius: 5,
            bgcolor: "var(--color-bg-drawer)",
            width: 300,
            boxShadow: "0 0 6px rgba(0,0,0,0.4)",
          }}
        >
          <SearchIcon sx={{ color: "var(--color-accent)", mr: 1 }} />
          <InputBase
            placeholder="Поиск по событиям..."
            sx={{ color: "var(--color-text)", width: "100%" }}
            value={search}
          />
        </Paper>
      </Toolbar>
    </AppBar>
  );
}
