import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import DataOutput from './DataOutput';

describe('DataOutput component', () => {
    test('renders', async () => {
        const { debug } = render(<DataOutput />);
    });

    test('has frost dates starting at 0', async () => {
        const { findByText } = render(<DataOutput />);
        await findByText(/Spring Severe Frost: 0/);
        await findByText(/Spring Moderate Frost: 0/);
        await findByText(/Spring Light Frost: 0/);
        await findByText(/Fall Severe Frost: 0/);
        await findByText(/Fall Moderate Frost: 0/);
        await findByText(/Fall Light Frost: 0/);
    });

    test('has an API call button', async () => {
        const { debug, findByRole, findByText } = render(<DataOutput />);
        await screen.findByText((content, element) => {
            return element.tagName.toLowerCase() === 'ion-button' && content === 'Make API Call'
        });
    });
});
