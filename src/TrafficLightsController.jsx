import React from "react";
import { useMachine } from "@xstate/react";
import { trafficLightsControllerMachine } from "./trafficLightsControllerMachine";
import TrafficLight from "./TrafficLight.jsx";

const TrafficLights = () => {
  const [state, send] = useMachine(trafficLightsControllerMachine);

  return (
    <div className="dashboard">
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
        <button onClick={() => send("ADD_LIGHT")}>Add</button>
      </div>
      <div className="lights">
        {state.context.lights.map((light, i) => {
          return <TrafficLight lightRef={light} key={light.id} />;
        })}
      </div>
    </div>
  );
};

export default TrafficLights;
