import { render, screen } from '@testing-library/react';
import { EditCaseFormSkeleton } from './edit-case-form-skeleton'; // Adjust path if necessary

// Mock the Skeleton component from ui/skeleton as it's a leaf component
// and we're only testing if EditCaseFormSkeleton renders its structure.
jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => <div data-testid="skeleton" className={className}></div>,
}));

describe('EditCaseFormSkeleton', () => {
  it('should render without crashing', () => {
    render(<EditCaseFormSkeleton />);
    // Check for one of the main structural elements or a few skeletons
    // For example, check if the CardHeader's first skeleton (title placeholder) is there.
    // This depends on the exact structure of your skeleton.
    // A simple check could be to ensure a certain number of skeleton elements are present.
    const skeletonElements = screen.getAllByTestId('skeleton');
    expect(skeletonElements.length).toBeGreaterThan(5); // Expecting at least several skeleton parts
  });

  it('should render placeholders for form sections', () => {
    render(<EditCaseFormSkeleton />);
    // Example: Check for a skeleton that represents an input field in the left column
    // and the placeholder for TeethFormData in the right column.
    // These checks would be more specific if the skeletons had unique test-ids or roles.
    // For now, checking the count is a reasonable smoke test.
    const leftColumnSkeletons = screen.getAllByTestId('skeleton').filter(el =>
        el.className.includes('w-full') && el.className.includes('h-10') // Typical for input skeleton
    );
    expect(leftColumnSkeletons.length).toBeGreaterThanOrEqual(5); // Check for input field skeletons

    const teethFormPlaceholder = screen.getAllByTestId('skeleton').find(el =>
        el.className.includes('h-[300px]') // Specific to TeethFormData placeholder
    );
    expect(teethFormPlaceholder).toBeInTheDocument();
  });
});
