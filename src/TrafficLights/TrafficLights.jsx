import React from "react";
import { useMachine } from "@xstate/react";
import "./TrafficLights.css";
import TrafficLight from "../TrafficLight";
import { trafficLightsControlMachine } from "../trafficLightsControlMachine";

const TrafficLights = () => {
  const [state, send] = useMachine(trafficLightsControlMachine);

  return (
    <div className="dashboard">
      <div className="controls">
        <button
          disabled={state.value === "active"}
          onClick={() => send("START")}
        >
          Start
        </button>
        <button
          disabled={state.value === "inactive"}
          onClick={() => send("STOP")}
        >
          Stop
        </button>
        <button onClick={() => send("ADD_LIGHT")}>Add</button>
      </div>
      <div className="lights">
        {state.context.lights.map((light, i) => {
          return <TrafficLight lightRef={light.ref} key={`light-${i}`} />;
        })}
      </div>
    </div>
  );
};

export default TrafficLights;
