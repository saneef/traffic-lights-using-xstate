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
      ADD_LIGHT: { target: "active", actions: "addLight" },
      END_OF_CYCLE: {
        actions: "setNextLightToProceed",
      },
      END_OF_LIFE: {
        target: "active",
        actions: "removeLight",
      },
    },
    states: {
      bootup: {
        always: {
          actions: ["initialiseLights"],
          target: "active",
        },
      },
      active: {
        entry: ["setFirstLightToProceed"],
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
      initialiseLights: assign({
        lights: (context, event) =>
          Array.from({ length: 3 }).map((l, i) => ({
            id: i,
            ref: spawn(createTrafficLightMachine(i)),
          })),
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
      removeLight: assign({
        lights: (context, event) => {
          const { lightId } = event;
          const { lights } = context;

          const light = lights.find((l) => l.id === lightId);
          if (light) {
            light.ref.stop();
          }
          return lights.filter((l) => l.id !== lightId);
        },
      }),
      powerDownLights: (context) =>
        context.lights.forEach((l) => l.ref.send("POWER_DOWN")),
    },
  }
);
