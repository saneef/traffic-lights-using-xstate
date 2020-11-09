const { createMachine, assign, sendParent } = require("xstate");

export const createTrafficLightMachine = (
  lightId,
  durations = {
    proceed: 2,
    caution: 1
  }
) =>
  createMachine(
    {
      id: "traffic-light",
      initial: "inactive",
      context: {
        lightId,
        durations,
        counter: 0
      },
      invoke: {
        id: "ticker",
        src: (context, event) => (callback, onReceive) => {
          const id = setInterval(() => callback("TICK"), 1000);
          return () => clearInterval(id);
        }
      },
      on: {
        PROCEED: "active.proceed",
        STOP: "active.stop"
      },
      states: {
        active: {
          initial: "stop",
          on: {
            POWER_DOWN: "inactive",
            TICK: { actions: "incCounter" }
          },
          states: {
            stop: {},
            proceed: {
              entry: ["resetCounter"],
              on: { TICK: { target: "caution", cond: "elapsedProceed" } }
            },
            caution: {
              entry: ["resetCounter"],
              on: {
                TICK: {
                  target: "stop",
                  cond: "elapsedCaution",
                  actions: "notifyEndOfCycle"
                }
              }
            }
          }
        },
        inactive: {
          initial: "on",
          on: {
            POWER_UP: "active"
          },
          states: {
            on: {
              on: {
                TICK: "off"
              }
            },
            off: {
              on: {
                TICK: "on"
              }
            }
          }
        }
      }
    },
    {
      actions: {
        resetCounter: assign({
          counter: 0
        }),
        incCounter: assign({
          counter: (context) => context.counter + 1
        }),
        notifyEndOfCycle: sendParent((context) => {
          return {
            type: "END_OF_CYCLE",
            lightId: context.lightId
          };
        })
      },
      guards: {
        elapsedProceed: (context) =>
          context.counter > context.durations.proceed,
        elapsedCaution: (context) => context.counter > context.durations.caution
      }
    }
  );
