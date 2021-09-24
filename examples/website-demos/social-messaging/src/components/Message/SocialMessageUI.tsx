import {
  Attachment,
  Avatar,
  ReactionSelector,
  messageHasReactions,
  MessageOptions,
  MessageRepliesCountButton,
  MessageText,
  MessageTimestamp,
  MessageUIComponentProps,
  SimpleReactionsList,
  useChannelStateContext,
  useChatContext,
  useMessageContext,
} from 'stream-chat-react';
import { DeliveredCheckmark, DoubleCheckmark, } from '../../assets';

import {
  SocialAttachmentType,
  SocialChannelType,
  SocialCommandType,
  SocialEventType,
  SocialMessageType,
  SocialReactionType,
  SocialUserType,
} from '../ChatContainer/ChatContainer';

import './SocialMessageUI.scss';

export const SocialMessage: React.FC<
  MessageUIComponentProps<
    SocialAttachmentType,
    SocialChannelType,
    SocialCommandType,
    SocialEventType,
    SocialMessageType,
    SocialReactionType,
    SocialUserType
  >
> = (props) => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const { isMyMessage, isReactionEnabled, message, readBy, reactionSelectorRef, showDetailedReactions } = useMessageContext<
    SocialAttachmentType,
    SocialChannelType,
    SocialCommandType,
    SocialEventType,
    SocialMessageType,
    SocialReactionType,
    SocialUserType
  >();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID,
  ).length;

  const hasReactions = messageHasReactions(message);

  const myMessage = isMyMessage();

  const readByMembers = readBy?.filter((user) => user.id !== client.user?.id);
  const readByMembersLength = readByMembers?.length === 0 ? undefined : readByMembers?.length;

  // Group Channel
  if (members > 2) {
    return (
      <div className={`message-wrapper ${myMessage ? 'right' : ''}`}>
        {!myMessage && <Avatar size={36} image={message.user?.image} name={message.user?.name} />}
        <div className='message-wrapper-inner'>
          {message.attachments?.length ? <Attachment attachments={message.attachments} /> : null}
          <MessageText customWrapperClass={`${myMessage ? 'my-message' : ''}`} />
          <div className={`message-wrapper-inner-data ${myMessage ? 'my-message' : ''}`}>
            {!myMessage && (
              <div className='message-wrapper-inner-data-info'>
                {message.user?.name || message.user?.id}
              </div>
            )}
            {myMessage && readByMembersLength && (
              <>
                <span className='message-wrapper-inner-data-readby'>{readByMembersLength}</span>{' '}
                <DoubleCheckmark />
              </>
            )}
            <MessageTimestamp customClass='message-wrapper-inner-data-time' />
          </div>
        </div>
      </div>
    );
  }

  // DM channel
  return (
    <div className={`message-wrapper ${myMessage ? 'right' : ''}`}>
      {!myMessage && <Avatar size={36} image={message.user?.image} />}
      <div className='message-wrapper-inner'>
        <MessageText customWrapperClass={`${myMessage ? 'my-message' : ''}`} />
        {message.attachments?.length ? <Attachment attachments={message.attachments} /> : null}
        {message.thread_participants ? (
        <div className='message-wrapper-inner-reply'>
          <MessageRepliesCountButton reply_count={message.reply_count} />
          <Avatar size={16} image={message.thread_participants[0].image} />
        </div> ) : null}
        <MessageOptions displayLeft={false} displayReplies={true} />
        {showDetailedReactions && isReactionEnabled && (
          <ReactionSelector ref={reactionSelectorRef} />
          )}
        {hasReactions && !showDetailedReactions && isReactionEnabled && <SimpleReactionsList />}
        <div className={`message-wrapper-inner-data ${myMessage ? 'my-message' : ''}`}>
          {!myMessage && (
            <div className='message-wrapper-inner-data-info'>
              {message.user?.name || message.user?.id}
            </div>
          )}
          {myMessage &&
            message.status === 'received' &&
            readByMembers &&
            readByMembers?.length < 1 && <DeliveredCheckmark />}
          {myMessage && readByMembers && readByMembersLength && <DoubleCheckmark />}
          <MessageTimestamp customClass='message-wrapper-inner-data-time' />
        </div>
      </div>
    </div>
  );
};
