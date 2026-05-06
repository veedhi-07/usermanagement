import PageBreadcrumb from "../../../components/common/page-bread-crumb/index";
import DefaultInputs from "./default-input";
// import InputGroup from "./input-group";
import CheckboxComponents from "./check-box";
import PageMeta from "../../../components/common/page-meta";
export default function FormElements() {
  return (
    <div>
      <PageMeta title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template" />
      <PageBreadcrumb pageTitle="Form Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
        </div>
        <div className="space-y-6">
          <CheckboxComponents />
        </div>
      </div>
    </div>
  );
}
