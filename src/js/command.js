import polyfill from "./keyboardEventPolyfill";
polyfill();

const addListener = (element, handler) => {
    element.addEventListener("keydown", handler);
};

const removeListener = (element, handler) => {
    element.removeEventListener("keydown", handler);
};

const command = (triggerKey, modal, {className="command"} = {}) => {
    // let props = {className};
    const commands = {
        fallback(command, modal) {
            const commands = api.list().filter(cmd => cmd !== "fallback");
            modal.message = [
                `${triggerKey}${command} is invalid :'(`,
                `try one of ${triggerKey}${commands.join(`, ${triggerKey}`)}`
            ].join(" ");
            modal.keys = triggerKey;
            listening = true;
        }
    };

    let listening = false;
    const handler = (e) => {
        const key = e.key;
        if (key === triggerKey) {
            listening = true;
            modal.init();
        }
        if (listening && key === "Enter") {
            listening = false;
            const keys = modal.keys;
            api.trigger(keys.substr(1));
        }
        if (key === "Escape") {
            modal.keys = "";
            modal.kill();
        }
    };
    addListener(document.body, handler);

    const api = {};
    api.register = (commandString, cb) => {
        commands[commandString] = cb;
        return api;
    };
    api.remove = (commandString) => {
        delete commands[commandString];
        return api;
    };
    api.trigger = (commandString, ...args) => {
        if (api.list().indexOf(commandString) < 0) {
            commands["fallback"](commandString, modal);
        } else {
            commands[commandString](commandString, ...args);
            modal.kill();
        }
        return api;
    };
    api.list = () => Object.keys(commands);
    api.stop = () => {
        removeListener(document.body, handler);
        return true;
    };
    return api;
};

export default command;
