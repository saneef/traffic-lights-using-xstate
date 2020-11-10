import React from "react";
import { useActor } from "@xstate/react";

const TrafficLight = ({ lightRef }) => {
  const [state, send] = useActor(lightRef);

  return (
    <div className="traffic-light">
      <ul className="traffic-light__frame">
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
      </ul>
      <div className="traffic-light__display">
        <div>
          {state.value.active === "proceed" || state.value.active === "caution"
            ? state.context.counter
            : "—"}
        </div>

        <div>
          <p className="font-caps text-light">State</p>
          <code className="traffic-light__meta font-mono font-xs break-words">
            {JSON.stringify(state.value)}
          </code>
        </div>

        <div>
          <p className="font-caps text-light">Light ID</p>
          <code className="traffic-light__meta font-mono font-xs break-words">
            {state.context.lightId}
          </code>
        </div>

        <div>
          <p className="font-caps text-light">Durations</p>
          <code className="traffic-light__meta font-mono font-xs break-words">
            {JSON.stringify(state.context.durations)}
          </code>
        </div>

        <div className="traffic-light__action">
          <button data-action-type="danger" onClick={() => send("REMOVE")}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrafficLight;
