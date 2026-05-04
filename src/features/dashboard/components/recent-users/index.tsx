import { useDashboard } from "../../hooks";
import PageMeta from "../../../../components/common/page-meta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import type { RecentUsers } from "../../types";

export default function RecentUsers() {
  const { recentUsers } = useDashboard();
  return (
    <>
      <PageMeta title="Users Page" />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] ">
          <div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center justify-between p-3">
                <h3 className="text-base font-extrabold text-gray-800 dark:text-white/90">
                  Recent Users
                </h3>
              </div>
            </div>

            <div className="max-w-full overflow-x-auto max-h-[460px] overflow-y-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-7 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      User Details
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-7 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Role
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-7 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-7 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Joined At
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {recentUsers.map((user: RecentUsers) => (
                    <TableRow key={user.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {user.username}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.roleTitle}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {user.joinedAt
                          ? new Date(user.joinedAt).toLocaleString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
