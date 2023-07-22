import { Burger, Center, Grid, Stack, Text, Title, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { globals } from "../globals";
import { HomeButton, LogoutButton } from "./TopbarMenu";

const Topbar = () => {
  const smallScreen = globals.isSmallScreen;
  const phoneScreen = globals.isPhoneScreen;
  const [burgerOpened, { toggle: toggleBurger }] = useDisclosure(false);

  return (
    <>
      <Grid>
          <Grid.Col span={1}>
            <Burger
              opened={burgerOpened}
              onClick={() => {
                toggleBurger();
              }}
              aria-label={burgerOpened ? "Close side bar" : "Open side bar"}
            />
          </Grid.Col>
          {!burgerOpened? (
        <Grid.Col offset={0} span={9}>
          <Center>
            <Stack spacing={"0px"} ml={"80px"}>
              <span style={{ textAlign: "center" }}>
                <Title style={{ display: "inline", marginLeft: "50px" }} order={smallScreen ? 3 : 1}>
                  LarpApp
                </Title>
                {phoneScreen ? null : (
                  <Text style={{ display: "inline", verticalAlign: "top" }} c="dimmed" fz="xs">
                    &nbsp; by Steven
                  </Text>
                )}
              </span>

              {phoneScreen || smallScreen ? null : (
                <Text c="dimmed" fz="sm" ta="center">
                  A VtM v5 Character Creator
                </Text>
              )}
            </Stack>
          </Center>
        </Grid.Col>
          ):
            (
        <>
            <Anchor>
                <HomeButton></HomeButton>
            </Anchor>
            <Anchor>
                <LogoutButton></LogoutButton>
            </Anchor>
        </>
        )}
      </Grid>
    </>
  );
};

export default Topbar;
