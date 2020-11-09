import { createMachine, spawn, assign } from "xstate";
import { createTrafficLightMachine } from "./trafficLightMachine";

export const trafficLightsControllerMachine = createMachine(
  {
    id: "traffic-lights",
    initial: "bootup",
    context: {
      lights: [],
    },
    on: {
      ADD_LIGHT: "bootup",
      END_OF_CYCLE: {
        actions: "setNextLightToProceed",
      },
    },
    states: {
      bootup: {
        always: {
          actions: ["addLight"],
          target: "active",
        },
      },
      active: {
        entry: ["powerUpLights", "setFirstLightToProceed"],
        on: {
          STOP: { target: "inactive" },
        },
      },
      inactive: {
        entry: ["powerDownLights"],
        on: {
          START: { target: "active" },
        },
      },
    },
  },
  {
    actions: {
      addLight: assign({
        lights: (context, event) => {
          const id = context.lights.length;
          const light = spawn(createTrafficLightMachine(id));

          return context.lights.concat({ id, ref: light });
        },
      }),
      setFirstLightToProceed: (context) => {
        context.lights.forEach((light, i) =>
          light.ref.send(i === 0 ? "PROCEED" : "STOP")
        );
      },
      setNextLightToProceed: (context, event) => {
        const { lightId } = event;
        const lights = context.lights;
        const index = lights.findIndex((l) => l.id === lightId);

        if (index === lights.length - 1) {
          lights[0].ref.send("PROCEED");
        } else {
          lights[index + 1].ref.send("PROCEED");
        }
      },
      tickLights: (context) => context.lights.forEach((l) => l.send("TICK")),
      powerDownLights: (context) =>
        context.lights.forEach((l) => l.ref.send("POWER_DOWN")),
      powerUpLights: (context) =>
        context.lights.forEach((l) => l.ref.send("POWER_UP")),
    },
  }
);
