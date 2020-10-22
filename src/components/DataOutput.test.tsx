import React from 'react';
import { render } from '@testing-library/react';
import DataOutput from './DataOutput';

describe('DataOutput', () => {
    test('renders DataOutput component', async () => {
        const { debug } = render(<DataOutput />);
    });

    test('Spring severe frost value starts at 0', async () => {
        const { findByText } = render(<DataOutput />);
        await findByText(/Spring Severe Frost: 0/);
        await findByText(/Spring Moderate Frost: 0/);
        await findByText(/Spring Light Frost: 0/);
        await findByText(/Fall Severe Frost: 0/);
        await findByText(/Fall Moderate Frost: 0/);
        await findByText(/Fall Light Frost: 0/);
    });
});
