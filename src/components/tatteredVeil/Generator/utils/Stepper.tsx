import { Aside, Center, ScrollArea, Stepper } from "@mantine/core"
import { Awakened } from "../../data/Awakened"
import { attributesCreationPointsCheck } from "../../data/Attributes"
import { SkillCreationPointsCheck } from "../../data/Skills"
import { checkArcanaCreationPointsTotal } from "../../data/Arcanum"
import { checkRoteCreationPoints } from "../../data/Rotes"
import { checkMeritCreationPoints } from "../../data/Merits"
import { currentExperience } from "../../data/Experience"
import { globals } from "../../../../globals"
import { useState, useEffect } from "react"

export type StepperProps = {
    selectedStep: number,
    setSelectedStep: (step: number) => void,
    awakened: Awakened
}

const NavBar = ({ selectedStep, setSelectedStep, awakened}: StepperProps) => {

    const getDisabledConditions = (step:number) => {
        let value = false
        if (step >= 1) {
            value = !awakened.name || !awakened.concept || !awakened.virtue || !awakened.vice
            if (value) {
                return value
            }
        }
        if (step >= 2) {
            value = !attributesCreationPointsCheck(awakened)
            if (value) {
                return value
            }
        }
        if (step >= 3) {
            value = !SkillCreationPointsCheck(awakened)

            if (value) {
                return value
            }
        }
        if (step >= 4) {
            value = !awakened.path

            if (value) {
                return value
            }
        }
        if (step >= 5) {
            value = !awakened.order

            if (value) {
                return value
            }
        }
        if (step >= 6) {
            value = !checkArcanaCreationPointsTotal(awakened) || !checkRoteCreationPoints(awakened)

            if (value) {
                return value
            }
        }
        if (step >= 7) {
            value = !checkMeritCreationPoints(awakened)

            if (value) {
                return value
            }
        }
        if (step >= 8) {
            value = !(currentExperience(awakened) < 10)

            if (value) {
                return value
            }
        }
        return value
    }

    const getStepper = () => {
        return (
            <Stepper orientation="vertical" color="blue" size="sm" active={selectedStep} onStepClick={setSelectedStep} breakpoint="sm">
                <Stepper.Step key={"Basics"} label={"Intro"} description=""> </Stepper.Step>
                <Stepper.Step key={"Attributes"} label={"Attributes"} description="" disabled={getDisabledConditions(1)} icon={getDisabledConditions(1)? "x":"2"}> </Stepper.Step>
                <Stepper.Step key={"Skills"} label={"Skills"} description="" disabled={getDisabledConditions(2)} icon={getDisabledConditions(2)? "x":"3"}> </Stepper.Step>
                <Stepper.Step key={"Path"} label={"Path"} description="" disabled={getDisabledConditions(3)} icon={getDisabledConditions(3)? "x":"4"}> </Stepper.Step>
                <Stepper.Step key={"Order"} label={"Order"} description="" disabled={getDisabledConditions(4)} icon={getDisabledConditions(4)? "x":"5"}> </Stepper.Step>
                <Stepper.Step key={"Arcana"} label={"Arcana"} description="" disabled={getDisabledConditions(5)} icon={getDisabledConditions(5)? "x":"6"}> </Stepper.Step>
                <Stepper.Step key={"Merits"} label={"Merits"} description="" disabled={getDisabledConditions(6)} icon={getDisabledConditions(6)? "x":"7"}> </Stepper.Step>
                <Stepper.Step key={"Experience"} label={"Experience"} description="" disabled={getDisabledConditions(7)} icon={getDisabledConditions(7)? "x":"8"}> </Stepper.Step>
                <Stepper.Step key={"Finishing Touches"} label={"Finishing Touches"} description="" disabled={getDisabledConditions(8)} icon={getDisabledConditions(8)? "x":"9"}> </Stepper.Step>
                <Stepper.Step key={"Confirm"} label={"Confirm"} description="" disabled={getDisabledConditions(8)} icon={getDisabledConditions(8)? "x":"10"}></Stepper.Step>
            </Stepper>
        )
    }

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])
  

    const height = globals.viewportHeightPx
    const scrollerHeight = 900
    return (
        <>
        {showAsideBar? 
                <Aside p="md" hiddenBreakpoint="sm" width={{ xs: 200 }} style={{ zIndex: 0 }}>
                <Center h={"100%"}>
                    {height <= scrollerHeight
                        ? <ScrollArea h={height - 100}>
                            {getStepper()}
                        </ScrollArea>
                        : <>{getStepper()}</>
                    }
                </Center>
            </Aside>
        : <></>}


        </>
    )

}

export default NavBar