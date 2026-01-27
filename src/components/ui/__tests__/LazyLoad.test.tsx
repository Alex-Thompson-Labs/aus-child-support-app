import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { LazyLoad } from '../LazyLoad';

// Mock component to lazy load
const TestComponent = ({ message }: { message: string }) => (
  <Text testID="test-component">{message}</Text>
);

// Suppress console.error during tests to avoid noise from expected errors
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('LazyLoad', () => {
  it('should render loading fallback initially', () => {
    const loader = () =>
      new Promise<{ default: typeof TestComponent }>((resolve) => {
        setTimeout(() => resolve({ default: TestComponent }), 100);
      });

    const { getByTestId } = render(
      <LazyLoad
        loader={loader}
        componentProps={{ message: 'Hello World' }}
      />
    );

    // Should show loading indicator initially
    expect(() => getByTestId('test-component')).toThrow();
  });

  it('should render lazy-loaded component after loading', async () => {
    const loader = () =>
      Promise.resolve({ default: TestComponent });

    const { getByTestId } = render(
      <LazyLoad
        loader={loader}
        componentProps={{ message: 'Hello World' }}
      />
    );

    // Wait for component to load
    await waitFor(() => {
      expect(getByTestId('test-component')).toBeTruthy();
    });

    expect(getByTestId('test-component')).toHaveTextContent('Hello World');
  });

  it('should pass props correctly to lazy-loaded component', async () => {
    const loader = () =>
      Promise.resolve({ default: TestComponent });

    const testMessage = 'Test Message 123';
    const { getByTestId } = render(
      <LazyLoad
        loader={loader}
        componentProps={{ message: testMessage }}
      />
    );

    await waitFor(() => {
      expect(getByTestId('test-component')).toBeTruthy();
    });

    expect(getByTestId('test-component')).toHaveTextContent(testMessage);
  });

  it('should handle loading errors gracefully', async () => {
    const loader = () =>
      Promise.reject(new Error('Failed to load component'));

    const { getByText } = render(
      <LazyLoad
        loader={loader}
        componentProps={{ message: 'Hello World' }}
      />
    );

    // Wait for error boundary to catch the error
    await waitFor(() => {
      expect(getByText('Failed to Load Component')).toBeTruthy();
    });
  });

  it('should use custom loading fallback when provided', () => {
    const loader = () =>
      new Promise<{ default: typeof TestComponent }>((resolve) => {
        setTimeout(() => resolve({ default: TestComponent }), 100);
      });

    const CustomFallback = () => <Text testID="custom-fallback">Loading...</Text>;

    const { getByTestId } = render(
      <LazyLoad
        loader={loader}
        componentProps={{ message: 'Hello World' }}
        fallback={<CustomFallback />}
      />
    );

    expect(getByTestId('custom-fallback')).toBeTruthy();
  });
});
