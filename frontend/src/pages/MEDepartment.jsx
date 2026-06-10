import DepartmentTemplate from "../components/DepartmentTemplate";
import { DEPARTMENTS } from "../data/departments_v2";
import { usePublicDepartment } from "../hooks/usePublicDepartment";

export default function MEDepartment() {
  const { data, isLoading } = usePublicDepartment("ME");
  const dept = data ?? (isLoading ? null : DEPARTMENTS.me);
  if (!dept) return null;
  return <DepartmentTemplate dept={dept} />;
}
