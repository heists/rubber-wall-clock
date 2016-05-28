export default (radius) => {
    const rimWidth = radius * 0.08,
        rimPadding = rimWidth * 0.7,
        majorTickWidth = rimWidth * 0.5;
    return {
        rim: {
            width: rimWidth,
            padding: rimPadding
        },
        ticks: {
            y0: radius - rimWidth - rimPadding,
            minor: {
                width: rimWidth * 0.15,
                length: rimWidth * 0.8
            },
            major: {
                width: majorTickWidth,
                length: rimWidth * 2.3
            }
        },
        hands: {
            y0: radius * 0.19,
            hour: {
                width: majorTickWidth * 1.6,
                length: radius * 0.63
            },
            minute: {
                width: majorTickWidth * 0.9,
                length: radius * 1.02
            },
            seconds: {
                width: rimWidth * 0.15,
                length: radius * 1.02
            }
        }
    };
};
