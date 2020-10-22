import React from 'react';
import { render } from '@testing-library/react';
import DataOutput from './DataOutput';

describe('DataOutput', () => {
    test('renders DataOutput component', async () => {
        const { debug } = render(<DataOutput />);
    });
});
