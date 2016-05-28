const createModal = (container) => {
    const elements = {
        messages: document.createElement("div"),
        input: document.createElement("input")
    };
    const children = {};
    const create = (element) => container.appendChild(element);
    const api = {
        init() {
            elements.input.type = "text";
            children.input = create(elements.input);
            children.input.focus();
            return api;
        },
        set message(message) {
            children.messages = create(elements.messages);
            children.messages.innerHTML = message;
        },
        get message() {
            return children.messages.innerHTML;
        },
        set keys(keys) {
            children.input.value = keys;
            children.input.focus();
        },
        get keys() {
            return children.input.value;
        },
        kill() {
            this.message = "";
            this.keys = "";
            Object.keys(children).forEach(child => children[child].remove());
        }
    };
    return api;
};

export default createModal;
