import { render, screen, waitFor } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useApp, themeConfig } from '@laboratoria/react';
import App from '.';

describe('App', () => {
  beforeEach(() => {
    useApp.mockRestore();
  });

  it('should show loading when auth user is undefined', () => {
    useApp.mockReturnValue({ auth: {} });
    const { container } = render(
      <ThemeProvider theme={createTheme(themeConfig)}>
        <App />
      </ThemeProvider>
    );
    expect(container.outerHTML).toBe('<div>Loading...</div>');
  });

  it('should show spanish home by default', async () => {
    useApp.mockImplementation(() => ({
      auth: { user: null },
    }));
    render(
      <ThemeProvider theme={createTheme(themeConfig)}>
        <App />
      </ThemeProvider>
    );
    await waitFor(() => screen.getByText('Desarrollo Web'));
  });

  it('should show portuguese home when navigator.language is pt-BR', async () => {
    window.history.pushState({}, 'Test page', '/');
    const spy = jest.spyOn(window.navigator, 'language', 'get').mockReturnValue('pt');
    useApp.mockImplementation(() => ({
      auth: { user: null },
    }));
    render(
      <ThemeProvider theme={createTheme(themeConfig)}>
        <App />
      </ThemeProvider>
    );
    await waitFor(() => screen.getByText('Desenvolvimento Web'));
    spy.mockRestore();
  });
});
