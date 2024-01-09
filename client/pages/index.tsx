import * as React from 'react';

import { AllCategory } from '../src/apps/category/AllCategory';

import { AppLayout } from '~/common/layout/AppLayout';

export default function ChatPage() {
  return (
    <AppLayout>
      <AllCategory />
    </AppLayout>
  );
}
