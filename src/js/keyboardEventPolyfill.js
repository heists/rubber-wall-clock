const keys = {};

// symbols
Object.assign(keys, {
    8: "Backspace",
    9: "Tab",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Del",
    48: ["0", ")"],
    49: ["1", "!"],
    50: ["2", "@"],
    51: ["3", "£"],
    52: ["4", "$"],
    53: ["5", "%"],
    54: ["6", "^"],
    55: ["7", "&"],
    56: ["8", "*"],
    57: ["9", "("],
    91: "Meta",
    92: "OS",
    93: "Meta",
    191: ["/", "?"]
});

// f[1-24]
for (let i = 1; i <= 24; i++) keys[i + 111] = `F${i}`;

// letters
for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    keys[i] = [letter, letter.toUpperCase()];
}

const polyfill = () => {
    if ("key" in KeyboardEvent.prototype) {
        return false;
    }
    Object.defineProperty(KeyboardEvent.prototype, "key", {
        get() {
            const key = keys[this.which || this.keyCode];
            if (!key) {
                return "Unknown Key";
            }
            return Array.isArray(key) ? key[+this.shiftKey] : key;
        }
    });
};

export default polyfill;
