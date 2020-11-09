import React from "react";
import { useActor } from "@xstate/react";

const TrafficLight = ({ lightRef }) => {
  const [state] = useActor(lightRef);

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
    </ul>
  );
};

export default TrafficLight;
