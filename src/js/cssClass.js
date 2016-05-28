const cssClassSymbols = {
    modifier: "--",
    element: "__"
};

const setBase = (baseName) => {
    if (baseName === "") {
        throw new Error("Base name must be specified");
    }
    const classNames = {};
    classNames.base = baseName;

    const getClass = name => {
        if (!name) name = "base";
        return classNames[name];
    };
    const constructClass = (type, suffix, base) => {
        const _base = base.split(" ");
        const _construct = (type, suffix, base) => (
            base + cssClassSymbols[type] + suffix
        );
        return [].concat(_base).map(d => _construct(type, suffix, d)).join(" ");
    };

    const api = {
        get: name => ( getClass(name) ),
        getAll: () => ( classNames ),
        register: (name, {type, suffix, base}={type: null, base: null}) => {
            const baseClass = getClass(base);
            const newClass = constructClass(type, suffix, baseClass);
            classNames[name] = newClass;
            return api;
        },
        addElement: (suffix, base=null) => {
            const baseClass = getClass(base);
            return constructClass("element", suffix, baseClass);
        },
        addModifier: (suffix, base=null) => {
            const baseClass = getClass(base);
            return constructClass("modifier", suffix, baseClass);
        }
    };
    return api;
};

export default setBase;
