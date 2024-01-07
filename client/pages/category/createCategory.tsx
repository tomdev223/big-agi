import * as React from 'react';

import { CreateCategory } from '../../src/apps/category/CreateCategory';

import { AppLayout } from '~/common/layout/AppLayout';

export default function ChatPage() {
  return (
    <AppLayout>
      <CreateCategory />
    </AppLayout>
  );
}
