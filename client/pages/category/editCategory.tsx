import * as React from 'react';

import { EditCategory } from '../../src/apps/category/EditCategory';

import { AppLayout } from '~/common/layout/AppLayout';

export default function ChatPage() {
  return (
    <AppLayout>
      <EditCategory />
    </AppLayout>
  );
}
