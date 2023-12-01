import { Center, Stack, Alert, Grid, TextInput, Select, Text, MultiSelect, Button } from "@mantine/core";

import { TipTapRTE } from "../../components/TipTapRTE";
import { GoodIntentionsVenueStyleSheet } from "../../data/CaM/types/VSS"
import { globals } from "../../assets/globals";
import { SectName } from "../../data/GoodIntentions/types/V5Sect";
import { ClanName, allClans } from "../../data/GoodIntentions/types/V5Clans";
import { PredatorTypeName, allPredatorTypes } from "../../data/GoodIntentions/types/V5PredatorType";
import { loresheets } from "../../data/GoodIntentions/types/V5Loresheets";
import { meritFlawData } from "../../data/GoodIntentions/types/V5MeritsOrFlaws";
import { allPowers } from "../../data/GoodIntentions/types/V5Powers";
import { Rituals } from "../../data/GoodIntentions/types/V5Rituals";
import { Ceremonies } from "../../data/GoodIntentions/types/V5Ceremonies";
import { Formulae } from "../../data/GoodIntentions/types/V5Formulae";

import VssDropzone from "./VssDropzone";

type GiVssEditProps = {
    vssData: GoodIntentionsVenueStyleSheet;
    setVssData: (vssData: GoodIntentionsVenueStyleSheet) => void;
    handleVss: (vssData: GoodIntentionsVenueStyleSheet) => void;
}

const GiVssEdit = ({ vssData, setVssData, handleVss }: GiVssEditProps) => {

    const isPhoneScreen = globals.isPhoneScreen

    const dayData = [
        { value: '1', label: "Monday" },
        { value: '2', label: "Tuesday" },
        { value: '3', label: "Wednesday" },
        { value: '4', label: "Thursday" },
        { value: '5', label: "Friday" },
        { value: '6', label: "Saturday" },
        { value: '0', label: "Sunday" },
    ];

    const weekData = [
        { value: '1', label: "1st Week" },
        { value: '2', label: "2nd Week" },
        { value: '3', label: "3rd Week" },
        { value: '4', label: "4th Week" },
    ];

    const loresheetNames = loresheets.map(loresheet => loresheet.name);
    const meritNames = meritFlawData.map(mf => ({ value: mf.name, label: `${mf.category} - ${mf.name}` }));
    const powerNames = allPowers.map(p => ({ value: p.name, label: `${p.discipline} ${p.level} - ${p.name}` }))
    const ritualNames = Rituals.map(r => ({ value: r.name, label: `${r.level} - ${r.name}` }))
    const ceremonyNames = Ceremonies.map(r => ({ value: r.name, label: `${r.level} - ${r.name}` }))
    const formulaeNames = Formulae.map(r => ({ value: r.name, label: `${r.level} - ${r.name}` }))

    return (
        <Center>
            <Stack>
                <Alert color="gray" style={{ maxWidth: "700px" }}>
                    <Grid columns={isPhoneScreen ? 4 : 8}>
                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                style={{ width: "300px" }}
                                value={vssData.venueStyleSheet.name}
                                label="VSS Name"
                                onChange={(event) => setVssData({ ...vssData, venueStyleSheet: { ...vssData.venueStyleSheet, name: event.target.value } })}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Select
                                withAsterisk
                                style={{ width: "300px" }}
                                value={vssData.goodIntentionsVariables.sect}
                                data={["Anarch", "Camarilla", "Autarkis"]}
                                label="VSS Sect"
                                onChange={(val) => {
                                    if (!val) { return null }
                                    let trueVal = val as SectName
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, sect: trueVal } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                style={{ width: "300px" }}
                                value={vssData.venueStyleSheet.theme}
                                label="Theme"
                                onChange={(event) => setVssData({ ...vssData, venueStyleSheet: { ...vssData.venueStyleSheet, theme: event.target.value } })}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                style={{ width: "300px" }}
                                value={vssData.venueStyleSheet.mood}
                                label="Mood"
                                onChange={(event) => setVssData({ ...vssData, venueStyleSheet: { ...vssData.venueStyleSheet, mood: event.target.value } })}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Select
                                withAsterisk
                                style={{ width: "300px" }}
                                defaultValue={`${vssData.venueStyleSheet.scheduleDay}`}
                                data={dayData}
                                label="Schedule Day"
                                onChange={(val) => {
                                    if (!val) { return null }
                                    setVssData({ ...vssData, venueStyleSheet: { ...vssData.venueStyleSheet, scheduleDay: +val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Select
                                withAsterisk
                                style={{ width: "300px" }}
                                defaultValue={`${vssData.venueStyleSheet.scheduleWeek}`}
                                data={weekData}
                                label="Schedule Week"
                                onChange={(val) => {
                                    if (!val) { return null }
                                    setVssData({ ...vssData, venueStyleSheet: { ...vssData.venueStyleSheet, scheduleWeek: +val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Text>Setting</Text>
                            <TipTapRTE
                                html={vssData.venueStyleSheet.setting} setHTML={(val) => setVssData({
                                    ...vssData, venueStyleSheet:
                                    {
                                        ...vssData.venueStyleSheet, setting: val
                                    }
                                })}
                            />
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Text>Notes</Text>
                            <TipTapRTE
                                html={vssData.venueStyleSheet.notes} setHTML={(val) => setVssData({
                                    ...vssData, venueStyleSheet:
                                    {
                                        ...vssData.venueStyleSheet, notes: val
                                    }
                                })}
                            />
                        </Grid.Col>
                    </Grid>
                </Alert>
                <Alert color="gray" style={{ maxWidth: "700px" }}>
                    <VssDropzone vssData={vssData} setVssData={setVssData} />

                </Alert>
                <Alert color="gray" style={{ maxWidth: "700px" }}>
                    <Grid columns={isPhoneScreen ? 4 : 8}>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedSects}
                                data={["Anarch", "Camarilla", "Autarkis"]}
                                clearable
                                label="Restricted Sects"
                                onChange={(val) => {
                                    let trueVal = val as SectName[]
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedSects: trueVal } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedClans}
                                data={allClans}
                                clearable
                                label="Restricted Clans"
                                onChange={(val) => {
                                    let trueVal = val as ClanName[]
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedClans: trueVal } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedPredatorTypes}
                                data={allPredatorTypes}
                                clearable
                                label="Restricted Predator Types"
                                onChange={(val) => {
                                    let trueVal = val as PredatorTypeName[]
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedPredatorTypes: trueVal } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedLoresheets}
                                data={loresheetNames}
                                clearable
                                searchable
                                label="Restricted Loresheets"
                                onChange={(val) => {
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedLoresheets: val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedMerits}
                                data={meritNames}
                                clearable
                                searchable
                                label="Restricted Merits/Flaws"
                                onChange={(val) => {
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedMerits: val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedPowers}
                                data={powerNames}
                                clearable
                                searchable
                                label="Restricted Powers"
                                onChange={(val) => {
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedPowers: val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedRituals}
                                data={ritualNames}
                                clearable
                                searchable
                                label="Restricted Rituals"
                                onChange={(val) => {
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedRituals: val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedCeremonies}
                                data={ceremonyNames}
                                clearable
                                searchable
                                label="Restricted Ceremonies"
                                onChange={(val) => {
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedCeremonies: val } })
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <MultiSelect
                                style={{ width: "300px" }}
                                defaultValue={vssData.goodIntentionsVariables.bannedFormulae}
                                data={formulaeNames}
                                clearable
                                searchable
                                label="Restricted Formulae"
                                onChange={(val) => {
                                    setVssData({ ...vssData, goodIntentionsVariables: { ...vssData.goodIntentionsVariables, bannedFormulae: val } })
                                }}
                            />
                        </Grid.Col>
                    </Grid>
                </Alert>
                <Center>
                    <Button onClick={() => handleVss(vssData)}>
                        Update
                    </Button>
                </Center>
            </Stack>
        </Center>
    )
}

export default GiVssEdit