import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function CSDepartment() {
  const { data, isLoading } = usePublicDepartment("CSE");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.cse);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
