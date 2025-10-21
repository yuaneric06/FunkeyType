export default function Word(props) {
    const text = props.text;
    return (
        <div contenteditable="true">{text}</div>
    )
}