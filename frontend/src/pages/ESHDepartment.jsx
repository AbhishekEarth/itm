import React from "react";
import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";

export default function ESHDepartment() {
  return <DepartmentTemplate dept={DEPARTMENTS.esh} />;
}
