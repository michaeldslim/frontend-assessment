import { Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1">Hello World</Typography>
    </Stack>
  );
}
