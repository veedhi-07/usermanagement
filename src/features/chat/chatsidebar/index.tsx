import type { FC } from "react";
import { PlusIcon, ChevronDown, ChevronRight, UserRound } from "lucide-react";
import { useAppDispatch } from "../../../redux/hooks";
import type { ChatSidebarProps } from "../../../types/index";
import {
  setSpaceName,
  setIsGroupChat,
  setShowDirectChatModal,
  setShowSpaceModal,
  setConversationId,
  setShowDirectChats,
  setShowSpaces,
} from "../../../redux/reducer/ui-slice/index";
const ChatSidebar: FC<ChatSidebarProps> = ({
  directChats,
  spaces,
  unreadMsgCount,
  userMap,
  showDirectChats,
  currentUserId,
  showSpaces,
  setSelectedUser,
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="w-64">
      <div className="flex flex-row">
        <span>
          <div
            onClick={() => dispatch(setShowDirectChats(!showDirectChats))}
            className="pt-4 cursor-pointer text-white"
          >
            {showDirectChats ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
        </span>
        <span>
          <div className="pt-3 text-lg cursor-pointer text-white">
            Direct Messages
          </div>
        </span>
        <span>
          <div className="pt-3 ml-16 cursor-pointer text-white">
            <PlusIcon
              size={24}
              onClick={() => dispatch(setShowDirectChatModal(true))}
            />
          </div>
        </span>
      </div>
      {showDirectChats && (
        <div className="mt-3">
          {directChats.map((chat) => {
            if (!chat.participants) return null;

            const otherUserId = chat.participants.find(
              (id) => id !== currentUserId,
            );

            const user = otherUserId ? userMap[otherUserId] : null;

            return (
              <div
                key={chat.id}
                className="p-2 text-white cursor-pointer hover:bg-gray-700 rounded"
                onClick={() => {
                  if (!user) return;

                  dispatch(setConversationId(chat.id));
                  setSelectedUser(user);
                  dispatch(setIsGroupChat(false));
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  <span>
                    <UserRound className="w-5 h-5 text-white" />
                  </span>
                  <span>
                    {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                  </span>
                  <div className="pl-25">
                    {unreadMsgCount[chat.id] > 0 && (
                      <span className="bg-red-500 text-xs py-1 px-2 rounded-full">
                        {unreadMsgCount[chat.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-row">
        <span>
          <div
            onClick={() => dispatch(setShowSpaces(!showSpaces))}
            className="  pt-31 cursor-pointer text-white"
          >
            {showSpaces ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
        </span>
        <span>
          <div className="  pt-30 text-lg cursor-pointer text-white">
            Spaces
          </div>
        </span>
        <span>
          <div className="pt-30 ml-34 cursor-pointer text-white">
            <PlusIcon
              size={24}
              onClick={() => dispatch(setShowSpaceModal(true))}
            />
          </div>
        </span>
      </div>
      {showSpaces && (
        <div className="mt-3">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="p-2 text-white cursor-pointer hover:bg-gray-700 rounded"
              onClick={() => {
                dispatch(setConversationId(space.id));
                dispatch(setIsGroupChat(true));
                dispatch(setSpaceName(space.name || "Group"));
              }}
            >
              <span className=" pr-36">{space.name}</span>
              {unreadMsgCount[space.id] > 0 && (
                <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                  {unreadMsgCount[space.id]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ChatSidebar;
