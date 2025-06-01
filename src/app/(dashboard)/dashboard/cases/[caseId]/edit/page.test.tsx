// src/app/(dashboard)/dashboard/cases/[caseId]/edit/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import EditCasePage from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
  notFound: jest.fn(),
}));

// Mock hooks and components
jest.mock('@/features/cases/hooks/use-get-case-by-id');
jest.mock('@/components/page-loader', () => () => <div>Loading...</div>);
jest.mock('@/components/notFound', () => () => <div>NotFound</div>); // Mock our custom NotFound
jest.mock('@/components/cases/edit-case-form', () => ({ selectedCase }: { selectedCase: { patient: string } }) => (
  <div>EditCaseForm Mock: {selectedCase.patient}</div>
));


describe('EditCasePage', () => {
  // Directly use the imported mocks
  const mockUseParams = jest.requireMock('next/navigation').useParams;
  const mockUseGetCaseById = jest.requireMock('@/features/cases/hooks/use-get-case-by-id').useGetCaseById;
  const mockNotFoundNavigation = jest.requireMock('next/navigation').notFound;


  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ caseId: 'test-case-id' });
  });

  it('should render PageLoader when loading', () => {
    mockUseGetCaseById.mockReturnValue({ data: null, isLoading: true, isError: false });
    render(<EditCasePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error message when isError is true', () => {
    mockUseGetCaseById.mockReturnValue({ data: null, isLoading: false, isError: true });
    render(<EditCasePage />);
    expect(screen.getByText('Error fetching case data. Please try again later.')).toBeInTheDocument();
  });

  it('should render NotFound component when caseData is null and not loading/error', () => {
    mockUseGetCaseById.mockReturnValue({ data: null, isLoading: false, isError: false });
    render(<EditCasePage />);
    // We expect our custom NotFound component to be rendered
    expect(screen.getByText('NotFound')).toBeInTheDocument();
    // and next/navigation's notFound should not be called directly by the page anymore if it renders <NotFound />
    expect(mockNotFoundNavigation).not.toHaveBeenCalled();
  });


  it('should render EditCaseForm with case data on successful fetch', async () => {
    const mockCase = { $id: 'test-case-id', patient: 'John Doe', data: '{}' }; // Ensure mockCase matches Case type if strict
    mockUseGetCaseById.mockReturnValue({ data: mockCase, isLoading: false, isError: false });
    render(<EditCasePage />);

    await waitFor(() => {
      expect(screen.getByText(`EditCaseForm Mock: ${mockCase.patient}`)).toBeInTheDocument();
    });
  });

  it('should pass the correct caseId from params to useGetCaseById', () => {
    const testId = 'custom-id-123';
    mockUseParams.mockReturnValue({ caseId: testId });
    mockUseGetCaseById.mockReturnValue({ data: null, isLoading: true, isError: false }); // Return loading to prevent further rendering

    render(<EditCasePage />);

    expect(mockUseGetCaseById).toHaveBeenCalledWith(testId);
  });
});
