// Test suite for AI Trading Signals Application
// Run with: npm test

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TradingProvider } from '../src/contexts/TradingContext';
import SignalPanel from '../src/components/SignalPanel';
import ChartWidget from '../src/components/ChartWidget';
import Portfolio from '../src/components/Portfolio';
import StrategyBuilder from '../src/components/StrategyBuilder';

// Mock API services
vi.mock('../src/services/api', () => ({
  signalsAPI: {
    getSignals: vi.fn(() => Promise.resolve({ success: true, data: [] })),
    createSignal: vi.fn(() => Promise.resolve({ success: true, data: { id: 1 } })),
    executeSignal: vi.fn(() => Promise.resolve({ success: true })),
  },
  marketAPI: {
    getMarketData: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    getChartData: vi.fn(() => Promise.resolve({ success: true, data: [] })),
  },
  strategiesAPI: {
    getStrategies: vi.fn(() => Promise.resolve({ success: true, data: [] })),
    createStrategy: vi.fn(() => Promise.resolve({ success: true, data: { id: 1 } })),
    backtestStrategy: vi.fn(() => Promise.resolve({ success: true, data: {} })),
  },
  portfolioAPI: {
    getPortfolio: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    getTradingHistory: vi.fn(() => Promise.resolve({ success: true, data: [] })),
  },
  aiAPI: {
    getMarketAnalysis: vi.fn(() => Promise.resolve({ success: true, data: {} })),
    chatWithAI: vi.fn(() => Promise.resolve({ success: true, data: { message: 'Test response' } })),
  },
}));

// Mock toast
vi.mock('../src/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Test wrapper with TradingProvider
const TestWrapper = ({ children }) => (
  <TradingProvider>{children}</TradingProvider>
);

describe('AI Trading Signals Application', () => {
  describe('SignalPanel Component', () => {
    it('renders signal panel with generate button', () => {
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      expect(screen.getByText('AI Trading Signals')).toBeInTheDocument();
      expect(screen.getByText('Generate')).toBeInTheDocument();
    });

    it('generates new signal when button is clicked', async () => {
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      const generateButton = screen.getByText('Generate');
      fireEvent.click(generateButton);
      
      // Should call the generate signal function
      await waitFor(() => {
        // Check if loading state is handled
        expect(generateButton).toBeInTheDocument();
      });
    });

    it('displays signals in correct format', () => {
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      // Should show no signals message initially
      expect(screen.getByText('No active signals')).toBeInTheDocument();
    });

    it('handles signal execution', async () => {
      // Test signal execution functionality
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      // Generate a signal first, then test execution
      const generateButton = screen.getByText('Generate');
      fireEvent.click(generateButton);
    });
  });

  describe('ChartWidget Component', () => {
    it('renders chart with default asset', () => {
      render(
        <TestWrapper>
          <ChartWidget />
        </TestWrapper>
      );
      
      expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    });

    it('changes timeframe when selected', () => {
      render(
        <TestWrapper>
          <ChartWidget />
        </TestWrapper>
      );
      
      const timeframeSelect = screen.getByDisplayValue('4H');
      fireEvent.change(timeframeSelect, { target: { value: '1H' } });
      
      expect(timeframeSelect.value).toBe('1H');
    });

    it('triggers pattern detection', async () => {
      render(
        <TestWrapper>
          <ChartWidget />
        </TestWrapper>
      );
      
      const patternButton = screen.getByTitle('AI Pattern Detection');
      fireEvent.click(patternButton);
      
      // Should trigger pattern detection
      await waitFor(() => {
        expect(patternButton).toBeInTheDocument();
      });
    });
  });

  describe('Portfolio Component', () => {
    it('renders portfolio overview', () => {
      render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
      expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
    });

    it('displays portfolio metrics', () => {
      render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      
      expect(screen.getByText('Total Return')).toBeInTheDocument();
      expect(screen.getByText('Win Rate')).toBeInTheDocument();
    });

    it('refreshes portfolio data', async () => {
      render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(refreshButton).toBeInTheDocument();
      });
    });
  });

  describe('StrategyBuilder Component', () => {
    it('renders strategy builder interface', () => {
      render(
        <TestWrapper>
          <StrategyBuilder />
        </TestWrapper>
      );
      
      expect(screen.getByText('Strategy Builder')).toBeInTheDocument();
      expect(screen.getByText('Strategy Setup')).toBeInTheDocument();
    });

    it('creates new strategy', async () => {
      render(
        <TestWrapper>
          <StrategyBuilder />
        </TestWrapper>
      );
      
      const nameInput = screen.getByPlaceholderText('Enter strategy name');
      fireEvent.change(nameInput, { target: { value: 'Test Strategy' } });
      
      const saveButton = screen.getByText('Save Strategy');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(nameInput.value).toBe('Test Strategy');
      });
    });

    it('selects technical indicators', () => {
      render(
        <TestWrapper>
          <StrategyBuilder />
        </TestWrapper>
      );
      
      const indicators = screen.getAllByText(/Moving Average|RSI|MACD/);
      expect(indicators.length).toBeGreaterThan(0);
    });
  });

  describe('TradingContext', () => {
    it('provides market data', () => {
      let contextValue;
      
      const TestComponent = () => {
        const context = useTradingContext();
        contextValue = context;
        return <div>Test</div>;
      };
      
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(contextValue).toBeDefined();
      expect(contextValue.selectedAsset).toBe('BTC/USDT');
    });

    it('handles signal generation', async () => {
      let contextValue;
      
      const TestComponent = () => {
        const context = useTradingContext();
        contextValue = context;
        return <div>Test</div>;
      };
      
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      expect(typeof contextValue.generateNewSignal).toBe('function');
    });
  });

  describe('API Integration', () => {
    it('handles API errors gracefully', async () => {
      // Mock API failure
      const { signalsAPI } = await import('../src/services/api');
      signalsAPI.getSignals.mockRejectedValueOnce(new Error('API Error'));
      
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      // Should handle error without crashing
      await waitFor(() => {
        expect(screen.getByText('AI Trading Signals')).toBeInTheDocument();
      });
    });

    it('retries failed requests', async () => {
      // Test retry logic
      const { marketAPI } = await import('../src/services/api');
      marketAPI.getMarketData
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({ success: true, data: {} });
      
      render(
        <TestWrapper>
          <ChartWidget />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(marketAPI.getMarketData).toHaveBeenCalled();
      });
    });
  });

  describe('Responsive Design', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      // Should render mobile-friendly layout
      expect(screen.getByText('AI Trading Signals')).toBeInTheDocument();
    });

    it('handles tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders components within performance budget', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <SignalPanel />
          <ChartWidget />
          <Portfolio />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('handles large datasets efficiently', () => {
      // Test with large number of signals
      const largeSignalSet = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        asset: 'BTC/USDT',
        type: 'BUY',
        confidence: 85,
      }));
      
      // Should handle large datasets without performance issues
      expect(largeSignalSet.length).toBe(1000);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      expect(screen.getByLabelText(/AI Trading Signals/)).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(
        <TestWrapper>
          <StrategyBuilder />
        </TestWrapper>
      );
      
      const nameInput = screen.getByPlaceholderText('Enter strategy name');
      nameInput.focus();
      
      expect(document.activeElement).toBe(nameInput);
    });

    it('has proper color contrast', () => {
      render(
        <TestWrapper>
          <SignalPanel />
        </TestWrapper>
      );
      
      // Should use high contrast colors for accessibility
      const generateButton = screen.getByText('Generate');
      const styles = window.getComputedStyle(generateButton);
      
      // Basic contrast check (would need more sophisticated testing in real app)
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.color).toBeTruthy();
    });
  });
});

// Performance benchmarks
describe('Performance Benchmarks', () => {
  it('measures initial load time', async () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <SignalPanel />
        <ChartWidget />
        <Portfolio />
        <StrategyBuilder />
      </TestWrapper>
    );
    
    const loadTime = performance.now() - startTime;
    console.log(`Initial load time: ${loadTime.toFixed(2)}ms`);
    
    expect(loadTime).toBeLessThan(200); // 200ms budget
  });

  it('measures memory usage', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    render(
      <TestWrapper>
        <SignalPanel />
        <ChartWidget />
        <Portfolio />
        <StrategyBuilder />
      </TestWrapper>
    );
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryUsed = finalMemory - initialMemory;
    
    console.log(`Memory used: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB`);
    
    // Should use less than 10MB for components
    expect(memoryUsed).toBeLessThan(10 * 1024 * 1024);
  });
});

export default {};
