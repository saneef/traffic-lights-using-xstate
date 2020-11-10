import React from "react";
import { useActor } from "@xstate/react";

const TrafficLight = ({ lightRef }) => {
  const [state, send] = useActor(lightRef);

  return (
    <ul className="traffic-light">
      <li
        data-state={state.value.active === "stop" ? "on" : "off"}
        className="traffic-light__bulb traffic-light__bulb--red"
      >
        <span className="sr-only">Red</span>{" "}
      </li>
      <li
        data-state={
          state.value.active === "caution" || state.value.inactive === "on"
            ? "on"
            : "off"
        }
        className="traffic-light__bulb traffic-light__bulb--amber"
      >
        <span className="sr-only">Amber</span>{" "}
      </li>
      <li
        data-state={state.value.active === "proceed" ? "on" : "off"}
        className="traffic-light__bulb traffic-light__bulb--green"
      >
        <span className="sr-only">Green</span>{" "}
      </li>
      <li>
        {state.value.active === "proceed" || state.value.active === "caution"
          ? state.context.counter
          : "—"}
      </li>
      <li className="traffic-light__action">
        <button onClick={() => send("REMOVE")}>Remove</button>
      </li>
      <li>
        <code className="traffic-light__meta font-mono font-xs break-words">
          ID: {state.context.lightId}
          <br></br>
          <br></br>
          State: <br></br>
          {JSON.stringify(state.value)}
        </code>
      </li>
    </ul>
  );
};

export default TrafficLight;
