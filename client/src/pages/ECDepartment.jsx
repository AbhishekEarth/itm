import React from "react";
import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";

export default function ECDepartment() {
  return <DepartmentTemplate dept={DEPARTMENTS.ece} />;
}
