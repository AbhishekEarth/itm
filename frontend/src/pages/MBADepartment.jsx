import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function MBADepartment() {
  const { data, isLoading } = usePublicDepartment("MBA");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.mba);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
