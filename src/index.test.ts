import { derivative, evalPolynomial, zeros } from "."

describe(evalPolynomial, () => {
    it('2x + 1', () => {
        const p = [1,2]
        expect(evalPolynomial(p,0)).toEqual(1)
        expect(evalPolynomial(p,1)).toEqual(3)
        expect(evalPolynomial(p,2)).toEqual(5)
    })
})

describe(derivative, () => {
    test('2x + 1', () => {
        expect(derivative([1,2])).toEqual([2])
    })
    test('3x^2', () => {
        expect(derivative([0,0,3])).toEqual([0,6])
    })
    test('x^2 - 1', () => {
        expect(derivative([-1,0,1])).toEqual([0,2])
    })
})

describe(zeros, () => {
    test('2x + 1', () => {
        expect(zeros([1,2])).toEqual([-0.5])
    })

    test('2x', () => {
        expect(zeros([0,2])).toEqual([-0])
    })

    test('x^2 - 1', () => {
        expect(zeros([-1,0,1])).toEqual([-1,1])
    })

    test('x^{6}-x^{5}+-2x^{4}+.5x^{3}+.557', () => {
        expect(zeros([.557,0,0,.5,-2,-1,1])).toEqual([expect.closeTo(-0.917), expect.closeTo(0.777), expect.closeTo(1.894)])
    })
})