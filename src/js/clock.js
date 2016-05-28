import setBase from "./cssClass";
import Snap from "snapsvg";
import scaling from "./scaling";
import { random } from "./utils";

const addRotatedLine = (parent, degree, attributes={}) => {
    attributes.x1 = attributes.x2 = 0;
    return parent.line()
        .attr(attributes)
        .transform(`r${degree}`);
};

const addTicks = (origin, tickCount, cssClass) => {
    const rotationDegree = 360 / tickCount;
    return Array.apply(null, {length: tickCount})
        .map((d, i) => addRotatedLine(
            origin, rotationDegree * i, {class: cssClass}
        ), Number);
};

const calculateRotation = (type, value) => (
    { seconds: 360 / 60, minute: 360 / 60, hour: 360 / 12 }[type] * value
);

const addHands = (origin, types, now, clockClass) => {
    const time = {};
    const milliseconds = now.getMilliseconds();
    time.seconds = now.getSeconds() + (milliseconds / 1000),
    time.minute = now.getMinutes() + (time.seconds / 60),
    time.hour = now.getHours() + (time.minute / 60);

    return types.reduce((m, d) => {
        const handClass = clockClass.get("hands");
        const handGroupClass = clockClass.addModifier(d, "hands");
        m[d] = addRotatedLine(
            origin.g().attr("class", handGroupClass),
            calculateRotation(d, time[d]),
            {class: handClass}
        );
        return m;
    }, {});
};

const initialiseClockElements = (parent, now, clockClass) => {
    const origin = parent.g().attr("class", clockClass.get("base"));
    const clockRim = origin.circle().attr("class", clockClass.get("rim"));
    const tickClass = clockClass.get("ticks");
    const ticks = {
        minor: addTicks(origin, 60, tickClass),
        major: addTicks(origin, 12, tickClass)
    };
    const hands = addHands(
        origin,
        ["hour", "minute", "seconds"],
        now,
        clockClass
    );
    return {origin, clockRim, ticks, hands};
};

const positionLines = (lines, lineOrigin, lineSize) => (
    [].concat(lines).map(line => (
        line.attr({
            y1: lineOrigin,
            y2: lineOrigin - lineSize.length,
            "stroke-width": lineSize.width
        })
    ))
);

const drawClock = (svg, elements, sizes) => {
    const {radius, scaled} = sizes;
    svg.attr({
        "viewBox": `0 0 ${radius.paper * 2} ${radius.paper * 2}`,
        "preserveAspectRatio": "xMinYMin meet"
    });

    elements.origin.transform(`t${radius.paper},${radius.paper}`);

    elements.clockRim.attr({
        r: radius.clock,
        "stroke-width": scaled.rim.width
    });

    // Position lines for ticks and hands
    ["ticks", "hands"].map(type => (
        Object.keys(elements[type]).map(lineType => positionLines(
            elements[type][lineType], scaled[type].y0, scaled[type][lineType]
        ))
    ));
};

const toggleGlitch = (svg, elements, clockClass, sizes) => {
    const {radius, glitchOffset, glitchShadowHeight} = sizes;

    // document.getElementsByTagName("svg")[0].setAttribute("class", "clock-glitch");
    // const glitchGroup = svg.g().attr("class", "clock-glitch");

    const clockShadowCyanClass = createClockClass(
        `${clockClass.get("base")} ${clockClass.addModifier("glitch-cyan")}`);
    const elementsCloneCyan = initialiseClockElements(
        svg,
        new Date(),
        clockShadowCyanClass
    );
    const clipPathCyan = elementsCloneCyan.origin.rect().attr({
        "x": -radius.paper,
        "height": glitchShadowHeight.cyan,
        "width": radius.paper * 2
    });
    elementsCloneCyan.origin.attr("clipPath", clipPathCyan);

    const clockShadowRedClass = createClockClass(
        `${clockClass.get("base")} ${clockClass.addModifier("glitch-red")}`);
    const elementsCloneRed = initialiseClockElements(
        svg,
        new Date(),
        clockShadowRedClass
    );
    const clipPathRed = elementsCloneRed.origin.rect().attr({
        "x": -radius.paper,
        "height": glitchShadowHeight.red,
        "width": radius.paper * 2
    });
    elementsCloneRed.origin.attr("clipPath", clipPathRed);

    const cloneClockClass = createClockClass(
        `${clockClass.get("base")} ${clockClass.addModifier("glitch-clone")}`);
    const elementsClone = initialiseClockElements(
        svg,
        new Date(),
        cloneClockClass
    );

    const filterString = `
        <feTurbulence type="fractalNoise"
            baseFrequency="0 0.15" numOctaves="1" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" result="glitched"
            xChannelSelector="R" yChannelSelector="G" scale="30" />
        <feOffset in="glitched" dx="0" dy="0" result="glitched" />
    `;
    const filter = svg.filter(filterString).attr({
        "filterUnits": "objectBoundingBox",
        "id": "glitch"
    });
    elementsClone.origin.attr("filter", filter);

    const blinkOriginalClock = () => {
        const colour = Math.random() < 0.5 ? "red" : "cyan";
        elements.origin.attr("strokeOpacity", +(Math.random() < 0.1));
        elements.clockRim.attr("stroke", colour);
    };

    const noiseFilter = svg.filter(`
        <feTurbulence type="fractalNoise" baseFrequency="0.5" />
        <feComponentTransfer>
            <feFuncR type="linear" slope="2" intercept="-0.5" />
            <feFuncG type="linear" slope="2" intercept="-0.5" />
            <feFuncB type="linear" slope="2" intercept="-0.5" />
        </feComponentTransfer>
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.4" />
        </feComponentTransfer>
    `).attr({"filterUnits": "objectBoundingBox", "id": "noise"});
    // elementsClone.origin.attr("filter", noiseFilter);

    var stopped = false;
    (function frame() {
        if (stopped) return;
        const flag = Math.random() < 0.5 ? 1 : -1;
        filter.select("feTurbulence").attr(
            "baseFrequency",
            `0, ${random(0.01, 0.8)}`
        );
        filter.select("feOffset").attr({
            "dx": flag * random(0, glitchOffset.x),
            "dy": flag * random(0, glitchOffset.y)
        });
        filter.attr("width", `${random(90, 100)}%`);
        clipPathCyan.attr("y", random(-radius.paper, radius.paper));
        clipPathRed.attr("y", random(-radius.paper, radius.paper));
        blinkOriginalClock();
        requestAnimationFrame(frame);
    })();
    drawClock(svg, elementsClone, sizes);
    drawClock(svg, elementsCloneCyan, sizes);
    drawClock(svg, elementsCloneRed, sizes);

    return () => {
        stopped = true;
        elementsCloneCyan.origin.remove();
        elementsCloneRed.origin.remove();
        elementsClone.origin.remove();
        elements.origin.attr("strokeOpacity", 1);
        elements.clockRim.attr("stroke", "black");
    };
};

const createClock = (container, clockClass, cmd) => {
    const now = new Date(),
        svg = Snap(".svg"),
        elements = initialiseClockElements(svg, now, clockClass),
        sizes = {
            radius: { clock: 500 },
            glitchOffset: { x: 50, y: 25 },
            glitchShadowHeight: { cyan: 30, red: 15 }
        };
    sizes.scaled = scaling(sizes.radius.clock);
    sizes.radius.paper = sizes.radius.clock +
        Math.max(sizes.glitchOffset.x, sizes.glitchOffset.y) +
        sizes.scaled.rim.width * 0.5;

    drawClock(svg, elements, sizes);

    var stopGlitch;
    const _toggleGlitch = () => {
        stopGlitch = toggleGlitch(svg, elements, clockClass, sizes);
        cmd.register("stop", () => {
            stopGlitch();
            cmd.remove("stop");
        });
    };
    // _toggleGlitch();

    cmd.register("glitch", _toggleGlitch);
    cmd.register("kill", cmd.stop);
};

function createClockClass(baseClass) {
    return setBase(baseClass)
        .register("rim", {type: "element", suffix: "rim"})
        .register("ticks", {type: "element", suffix: "tick"})
        .register("hands", {type: "element", suffix: "hand"});
}

export default createClock;
export { createClockClass };
