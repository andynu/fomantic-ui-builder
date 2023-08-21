function indent(count) {
    return '  '.repeat(count);
}

function removeBlankLines(text) {
    return text.replace(/^\s*\n/gm, '');
}
const elementNodeType = 1;
const textNodeType = 3;

function nodeToHaml(node, indentCount = 0) {
    let haml = '';

    if (node.nodeType === elementNodeType) {

        haml += `\n${indent(indentCount)}%${node.tagName.toLowerCase()}`;

        if (node.attributes.length) {
            haml += `{${Array.from(node.attributes)
                .map(attr => `${attr.name}: '${attr.value}'`)
                .join(', ')}}`;
        }

        if (node.childNodes.length) {
            node.childNodes.forEach(childNode => {
                haml += nodeToHaml(childNode, indentCount + 1);
            });
        }

        // haml += `\n${indent(indentCount)}`;

    } else if (node.nodeType === textNodeType) {
        haml += `\n${indent(indentCount)}${node.textContent.trim()}\n`;
    }

    return haml;

}


const html = `
  <div id="container" class="wrapper">
    <h1>Title</h1>
    <p>Hello world!</p>
  </div>
`;

export default function html2haml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const haml = nodeToHaml(doc.body);
    return removeBlankLines(haml);
}