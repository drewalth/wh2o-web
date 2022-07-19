import { Description } from '../Description'
import { render, screen } from '@testing-library/react'

const renderDescription = () => render(<Description />)

describe('Description.tsx', () => {
  it('exists', () => {
    renderDescription()

    expect(screen.getByTestId('reach-description')).toBeTruthy()
  })
})
