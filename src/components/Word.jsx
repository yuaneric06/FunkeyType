export default function Word(props) {
    let text = props.text;
    const pStyle = Array(text.length).fill({
        color: 'gray'
    });
    

    // if we already typed the characters, process colors
    if (typeof props.typedWord == 'string') {
        const typedWord = props.typedWord;
        for (let i = 0; i < typedWord.length; i++) {
            if (i >= text.length) {
                text += typedWord[i];
                pStyle.push({
                    color: 'red'
                })
            }
            else if (typedWord[i] === text[i]) {
                pStyle[i] = {
                    color: '#D3D3D3'
                }
            }
            else if (typedWord[i] !== text[i]) {
                pStyle[i] = {
                    color: 'red'
                }
            }
        }
    }
    
    // create the actual dom elements
    const textElements = text.split('').map((letter, index) => {
        return <p style={pStyle[index]}>{letter}</p>;
    });
    return (
        <span>
            {textElements}
        </span>
    )
}