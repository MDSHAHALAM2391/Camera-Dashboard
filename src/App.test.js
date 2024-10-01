import { render, screen } from '@testing-library/react';
import App from './App';
import pkg from 'jest-watcher';
const { PatternPrompt, printPatternCaret, printRestoredPatternCaret } = pkg;

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Learn React/i);
  expect(linkElement).toBeInTheDocument();
});
