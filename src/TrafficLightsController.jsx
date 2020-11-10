import React from "react";
import { useMachine } from "@xstate/react";
import { trafficLightsControllerMachine } from "./trafficLightsControllerMachine";
import TrafficLight from "./TrafficLight.jsx";

const TrafficLights = () => {
  const [state, send] = useMachine(trafficLightsControllerMachine);

  return (
    <div className="dashboard">
      <div className="section section--compact">
        <h2 className="font-caps text-light">Controller</h2>
        <div className="controls">
          <button
            disabled={state.value === "active"}
            onClick={() => send("START")}
          >
            Activate
          </button>
          <button
            disabled={state.value === "inactive"}
            onClick={() => send("STOP")}
          >
            Deactivate
          </button>
          <button onClick={() => send("ADD_LIGHT")}>Add light</button>
          <span>
            <span className="font-caps text-light">State</span>{" "}
            <span className="font-mono font-xs break-words">
              {JSON.stringify(state.value)}
            </span>
          </span>
        </div>
      </div>

      <div className="section">
        <h2 className="font-caps text-light">Traffic Lights</h2>
        <div className="lights">
          {state.context.lights.map((light, i) => {
            return <TrafficLight lightRef={light} key={light.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default TrafficLights;
