import PageBreadcrumb from "../../components/common/page-bread-crumb";
import UserMetaCard from "./components/meta-card";
import UserInfoCard from "./components/info-card";
import PageMeta from "../../components/common/page-meta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title=" User Profile"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
