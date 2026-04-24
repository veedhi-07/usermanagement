import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../ComponentCard";
import PageMeta from "../../../../components/common/PageMeta";
import UserTable from "../../components/main-user-table/index";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <UserTable />
        </ComponentCard>
      </div>
    </>
  );
}
