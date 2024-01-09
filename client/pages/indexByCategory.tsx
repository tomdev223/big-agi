import * as React from 'react';

import { AppChatByCategory } from '../src/apps/chat/AppChatByCategory';
import { useShowNewsOnUpdate } from '../src/apps/news/news.hooks';

import { AppLayout } from '~/common/layout/AppLayout';

export default function ChatPage() {
  // show the News page on updates
  useShowNewsOnUpdate();

  return (
    <AppLayout>
      <AppChatByCategory />
    </AppLayout>
  );
}
