import createClock, { createClockClass } from "./js/clock";
import command from "./js/command";
import createModal from "./js/modal";

const cmdContainer = document.getElementsByClassName("command")[0];
const modal = createModal(cmdContainer);
const cmd = command("/", modal)
    .register("help", () => console.log("HELP"));

const container = document.getElementById("container");
const clockClass = createClockClass("clock");
createClock(container, clockClass, cmd);
