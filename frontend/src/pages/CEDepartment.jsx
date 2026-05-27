import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function CEDepartment() {
  const { data, isLoading } = usePublicDepartment("CE");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.ce);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
