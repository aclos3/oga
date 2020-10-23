import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import SubmitButton from './SubmitButton';

describe('SubmitButton component', () => {
    test('renders', async () => {
        const { debug } = render(<SubmitButton />);
    });
});
