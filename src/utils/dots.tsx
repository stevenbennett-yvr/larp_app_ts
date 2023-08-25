import { Text } from "@mantine/core"

type DotsProps = {
    n: number
}

const Dots = ({ n }: DotsProps) => {
    const style: React.CSSProperties = {
        verticalAlign: "middle"
    }

    switch (n) {
        case 0: return <Text style={style}>➀➀➀➀➀</Text>
        case 1: return <Text style={style}>➊➀➀➀➀</Text>
        case 2: return <Text style={style}>➊➊➀➀➀</Text>
        case 3: return <Text style={style}>➊➊➊➀➀</Text>
        case 4: return <Text style={style}>➊➊➊➊➀</Text>
        case 5: return <Text style={style}>➊➊➊➊➊</Text>
        default: return <Text color="red">{`Invalid tally number: ${n}`}</Text>
    }
}

export default Dots