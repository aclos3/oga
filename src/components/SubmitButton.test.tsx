import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import SubmitButton from './SubmitButton';

describe('SubmitButton component', () => {
    test('renders', async () => {
        const { debug } = render(<SubmitButton />);
    });

    test('has a Get Location button', async () => {
        const { debug, findByRole, findByText } = render(<SubmitButton />);
        await screen.findByText((content, element) => {
            return element.tagName.toLowerCase() === 'ion-button' && content === 'Get Location'
        });
    });
});
