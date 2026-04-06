type WorkerUser = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  createdAt?: string;
};

self.onmessage = function (e) {
  const { users, searchQuery, sortOrder } = e.data;

  const query = (searchQuery || "").toLowerCase();

  const result = (users as WorkerUser[])
    .filter((user: WorkerUser) => {
      const fullName =
        `${user.firstName} ${user.lastName} ${user.email || ""}`.toLowerCase();

      return fullName.includes(query);
    })
    .sort((a: WorkerUser, b: WorkerUser) => {
      const nameA = (a.firstName || "").toLowerCase();
      const nameB = (b.firstName || "").toLowerCase();

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  self.postMessage(result);
};
