import React from 'react';
import type { Preview, StoryFn } from '@storybook/react-vite';
import '../src/components';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      canvas: { sourceState: 'open' },
    },
    refs: false,
    remoteStories: false,
    options: {
      storySort: {
        order: [],
      },
    },
  },
  decorators: [
    (Story: StoryFn): React.ReactElement => {
      const StoryComponent = Story as React.ComponentType;
      return (
        <div style={{ padding: '20px' }}>
          <StoryComponent />
        </div>
      );
    },
  ],
};

export default preview;
