import { Users } from "lucide-react";

const NoConversation = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center w-87.5">
        <Users className="mx-auto mb-4 text-blue-500" size={40} />

        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          No Conversation Selected
        </h2>

        <p className="text-gray-500 text-sm">
          Select a user or create a group to start chatting.
        </p>
      </div>
    </div>
  );
};
export default NoConversation;
