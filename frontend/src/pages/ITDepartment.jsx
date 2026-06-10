import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function ITDepartment() {
  const { data, isLoading } = usePublicDepartment("IT");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.it);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
