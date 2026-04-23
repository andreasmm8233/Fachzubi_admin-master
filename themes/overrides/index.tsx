// third-party
import merge from "lodash.merge";
import Button from "./button";
import TextField from "./TextField";

// project import

// ==============================|| OVERRIDES - MAIN ||============================== //

export default function ComponentsOverrides() {
  return merge(TextField(), Button());
}
