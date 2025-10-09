/**
 * cn utility function tests
 */
import { cn } from '../cn'

describe('cn', () => {
  test('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  test('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false

    expect(cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled'
    )).toBe('base-class active')
  })

  test('merges conflicting Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  test('handles undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
  })

  test('handles empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2')
  })

  test('handles falsy values', () => {
    expect(cn('class1', false, 0, '', 'class2')).toBe('class1 class2')
  })

  test('preserves important classes', () => {
    expect(cn('text-red-500', 'text-blue-500!')).toBe('text-red-500 text-blue-500!')
  })

  test('handles responsive classes', () => {
    expect(cn('md:text-red-500', 'md:text-blue-500')).toBe('md:text-blue-500')
  })

  test('handles complex class combinations', () => {
    expect(cn(
      'px-4 py-2 rounded-md',
      'hover:bg-gray-100',
      'focus:ring-2 focus:ring-blue-500',
      'disabled:opacity-50'
    )).toBe('px-4 py-2 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 disabled:opacity-50')
  })

  test('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })

  test('handles single class', () => {
    expect(cn('single-class')).toBe('single-class')
  })

  test('handles array of classes', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
  })

  test('handles mixed arguments', () => {
    expect(cn('class1', ['class2', 'class3'], 'class4')).toBe('class1 class2 class3 class4')
  })
})