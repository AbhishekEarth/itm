import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function ECDepartment() {
  const { data, isLoading } = usePublicDepartment("ECE");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.ece);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
