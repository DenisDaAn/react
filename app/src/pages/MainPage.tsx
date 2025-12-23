import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Toolbar,
  Typography,
  Drawer,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import SportsIcon from "@mui/icons-material/Sports";
import { AppHeader } from "@/components/home/AppHeader";
import { LeaguesList } from "@/components/home/LeaguesList";

const drawerWidth = 260;

export function MainPage() {
  const [sports, setSports] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "*** | Home page";
    document.body.style.overflow = "hidden";

    axios
      .get("http://127.0.0.1:8000/all_events_fon")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setSports(data);
        setSelectedSport(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="var(--color-bg)"
      >
        <CircularProgress sx={{ color: "var(--color-accent)" }} />
      </Box>
    );
  }

  const filteredLeagues =
    selectedSport?.leagues?.filter((league: any) => {
      const term = search.toLowerCase();
      if (!term) return true;
      const inLeague = league.league.toLowerCase().includes(term);
      const inEvent = league.events.some(
        (e: any) =>
          (e.team1 && e.team1.toLowerCase().includes(term)) ||
          (e.team2 && e.team2.toLowerCase().includes(term)) ||
          (e.name && e.name.toLowerCase().includes(term))
      );
      return inLeague || inEvent;
    }) || [];

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "var(--color-bg)",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        color: "var(--color-text)",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "var(--color-bg-drawer)",
            color: "var(--color-text)",
            borderRight: "1px solid #333",
            overflowY: "auto",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 1 }}>
          {sports.map((sport) => (
            <ListItemButton
              key={sport.alias}
              selected={selectedSport?.alias === sport.alias}
              onClick={() => setSelectedSport(sport)}
              sx={{
                py: 2,
                px: 3,
                mb: 0.5,
                borderRadius: 1,
                transition: "var(--transition-base)",
                "&.Mui-selected": {
                  bgcolor: "var(--color-accent)",
                  color: "#101820",
                },
                "&:hover": {
                  bgcolor: "var(--color-accent-hover)",
                  opacity: 0.9,
                },
              }}
            >
              <SportsIcon sx={{ mr: 2 }} />
              <ListItemText primary={sport.sport} />
            </ListItemButton>
          ))}
        </Box>
        <Divider sx={{ borderColor: "#333" }} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppHeader search={search} setSearch={setSearch} />
        <Toolbar />
        {!selectedSport ? (
          <Typography variant="h6" color="var(--color-text-muted)" sx={{ m: 3 }}>
            Выберите вид спорта
          </Typography>
        ) : (
          <LeaguesList
            leagues={[{ ...selectedSport, leagues: filteredLeagues }]}
          />
        )}
      </Box>
    </Box>
  );
}
