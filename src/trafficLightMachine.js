const { createMachine, assign, sendParent } = require("xstate");

export const createTrafficLightMachine = (
  lightId,
  initial = "inactive",
  durations = {
    proceed: 3,
    caution: 2,
  }
) =>
  createMachine(
    {
      id: "traffic-light",
      initial,
      context: {
        lightId,
        durations,
        counter: 0,
      },
      invoke: {
        id: "ticker",
        src: (context, event) => (callback, onReceive) => {
          const id = setInterval(() => callback("TICK"), 1000);
          return () => clearInterval(id);
        },
      },
      on: {
        PROCEED: "active.proceed",
        STOP: "active.stop",
        REMOVE: { actions: "notifyEndOfLife" },
      },
      states: {
        active: {
          initial: "stop",
          on: {
            POWER_DOWN: "inactive",
            TICK: { actions: "decCounter" },
          },
          states: {
            stop: {},
            proceed: {
              entry: ["resetCounter"],
              on: {
                TICK: {
                  target: "caution",
                  cond: "elapsedProceed",
                  actions: "decCounter",
                },
              },
            },
            caution: {
              on: {
                TICK: {
                  target: "stop",
                  cond: "elapsedCaution",
                  actions: "notifyEndOfCycle",
                },
              },
            },
          },
        },
        inactive: {
          initial: "on",
          on: {
            POWER_UP: "active",
          },
          states: {
            on: {
              on: {
                TICK: "off",
              },
            },
            off: {
              on: {
                TICK: "on",
              },
            },
          },
        },
      },
    },
    {
      actions: {
        resetCounter: assign({
          counter: (context) =>
            context.durations.proceed + context.durations.caution,
        }),
        decCounter: assign({
          counter: (context) => context.counter - 1,
        }),
        notifyEndOfCycle: sendParent((context) => {
          return {
            type: "END_OF_CYCLE",
            lightId: context.lightId,
          };
        }),
        notifyEndOfLife: sendParent((context) => {
          return {
            type: "END_OF_LIFE",
            lightId: context.lightId,
          };
        }),
      },
      guards: {
        elapsedProceed: (context) =>
          context.counter <= context.durations.caution,
        elapsedCaution: (context) => context.counter <= 0,
      },
    }
  );
