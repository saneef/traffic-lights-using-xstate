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
      ADD_LIGHT: [
        { target: "active", actions: "addActiveLight", cond: "isActive" },
        { target: "inactive", actions: "addInactiveLight" },
      ],
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
      addActiveLight: assign({
        lights: (context, event) => {
          const id = `light-${context.lights.length}`;
          const light = spawn(
            createTrafficLightMachine(`light-${id}`, "active"),
            `light-${id}`
          );

          return context.lights.concat(light);
        },
      }),
      addInactiveLight: assign({
        lights: (context, event) => {
          const id = `light-${context.lights.length}`;
          const light = spawn(
            createTrafficLightMachine(`light-${id}`),
            `light-${id}`
          );

          return context.lights.concat(light);
        },
      }),
      initialiseLights: assign({
        lights: (context, event) =>
          Array.from({ length: 3 }).map((l, i) => {
            const id = `light-${i}`;
            return spawn(createTrafficLightMachine(id), id);
          }),
      }),
      setFirstLightToProceed: (context) => {
        context.lights.forEach((light, i) =>
          light.send(i === 0 ? "PROCEED" : "STOP")
        );
      },
      setNextLightToProceed: (context, event) => {
        const { lightId } = event;
        const lights = context.lights;
        const index = lights.findIndex((l) => l.id === lightId);

        if (index === lights.length - 1) {
          lights[0].send("PROCEED");
        } else {
          lights[index + 1].send("PROCEED");
        }
      },
      removeLight: assign({
        lights: (context, event) => {
          const { lightId } = event;
          const { lights } = context;

          const light = lights.find((l) => l.id === lightId);
          if (light) {
            light.stop();
          }
          return lights.filter((l) => l.id !== lightId);
        },
      }),
      powerDownLights: (context) =>
        context.lights.forEach((l) => l.send("POWER_DOWN")),
    },
    guards: {
      isActive: (context, event, condMeta) => condMeta.state.value === "active",
    },
  }
);
