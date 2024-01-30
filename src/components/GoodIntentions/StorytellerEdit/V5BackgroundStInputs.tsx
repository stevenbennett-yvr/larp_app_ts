import { Tooltip, Group, Text, MultiSelect, Table, Input } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { backgroundData, handleBackgroundChange, V5BackgroundRef, v5BackgroundLevel } from "../../../data/GoodIntentions/types/V5Backgrounds";
import { SphereSelectData, V5SphereKey } from "../../../data/GoodIntentions/types/V5Spheres";
import { upcase } from "../../../utils/case";

type V5BackgroundStInputProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
}

const BackgroundStInput = ({ kindred, setKindred }: V5BackgroundStInputProps) => {

    /*     type TypeCategory = 'creationPoints' | 'experiencePoints';
        const [selectedSphere, setSelectedSphere] = useState<V5SphereKey>("");
    
        const handleBackgroundBuy = (selectedBackground: string, pointsType: TypeCategory) => {
            let newBackgroundRef = v5BackgroundRefs.find((b) => b.name === selectedBackground);
            if (!newBackgroundRef) { return; }
    
            let newBackground = { ...newBackgroundRef, id: `${newBackgroundRef.id}-${Date.now()}}`, advantages: [] };
    
            if ((selectedBackground === 'Allies' || selectedBackground === 'Contacts') && selectedSphere) {
                newBackground = { ...newBackground, sphere: [selectedSphere] };
            }
    
            handleBackgroundChange(kindred, setKindred, newBackground, pointsType, pointsType === "experiencePoints" ? v5xp.background : 1);
        }
     */
    const backgroundRows = (backgrounds: V5BackgroundRef[]) => {
        return backgrounds.map((background) => {
            const backgroundInfo = backgroundData.find((entry) => entry.name === background.name);
            if (!backgroundInfo) { return null }

            return (
                <tr key={background.id}>
                    <td>
                        <Tooltip label={backgroundInfo.summary}>
                            <Group>
                                <FontAwesomeIcon icon={backgroundInfo.icon} style={{ color: "#e03131" }} />
                                <Text>{upcase(backgroundInfo.name)} Lvl: {v5BackgroundLevel(background).level}</Text>
                            </Group>
                        </Tooltip>
                    </td>

                    <td>
                        <MultiSelect
                            data={SphereSelectData}
                            value={background.sphere}
                            onChange={(val: V5SphereKey[]) => {
                                if (!val || !background.sphere) { return null }
                                handleBackgroundChange(kindred, setKindred, background, "sphere", val)
                            }}
                        />
                    </td>

                    <td>
                        <Input
                            type="number"
                            style={{
                                width: '50px',
                                margin: '0 8px',
                            }}
                            key={`st-${background.id}-cp`}
                            min={0}
                            max={3}
                            step={1}
                            value={background.creationPoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = Number(e.target.value);
                                handleBackgroundChange(kindred, setKindred, background, "creationPoints", val)
                            }}
                        />
                    </td>

                    <td>
                        <Input
                            type="number"
                            style={{
                                width: '50px',
                                margin: '0 8px',
                            }}
                            key={`st-${background.id}-xp`}
                            min={0}
                            max={3}
                            step={1}
                            value={background.experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = Number(e.target.value);
                                handleBackgroundChange(kindred, setKindred, background, "experiencePoints", val)
                            }}
                        />
                    </td>

                    <td>
                        <Input
                            type="number"
                            style={{
                                width: '50px',
                                margin: '0 8px',
                            }}
                            key={`st-${background.id}-ptfp`}
                            min={0}
                            max={3}
                            step={1}
                            value={background.predatorTypeFreebiePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = Number(e.target.value);
                                handleBackgroundChange(kindred, setKindred, background, "predatorTypeFreebiePoints", val)
                            }}
                        />
                    </td>

                    <td>
                        <Input
                            type="number"
                            style={{
                                width: '50px',
                                margin: '0 8px',
                            }}
                            key={`st-${background.id}-lsfp`}
                            min={0}
                            max={3}
                            step={1}
                            value={background.loresheetFreebiePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = Number(e.target.value);
                                handleBackgroundChange(kindred, setKindred, background, "loresheetFreebiePoints", val)
                            }}
                        />
                    </td>

                </tr>
            );
        });
    };

    return (
        <Table>
            <thead>
                <tr>
                    <td>
                        Name
                    </td>
                    <td>
                        Sphere
                    </td>
                    <td>
                        CP
                    </td>
                    <td>
                        XP
                    </td>
                    <td>
                        PtFP
                    </td>
                    <td>
                        LsFP
                    </td>
                </tr>
            </thead>
            <tbody>
                {backgroundRows(kindred.backgrounds)}
            </tbody>
        </Table>
    )
}

export default BackgroundStInput