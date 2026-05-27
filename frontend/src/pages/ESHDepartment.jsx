import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function ESHDepartment() {
  const { data, isLoading } = usePublicDepartment("ESH");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.esh);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
