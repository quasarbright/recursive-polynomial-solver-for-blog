// A polynomial solver

// The coefficient of degree i of polynomial p is p[i]
type Polynomial = number[]

const TOLERANCE = 0.001

// find all zeros of the polynomial, sorted.
// for p = 0, return no zeros
export function zeros(p: Polynomial): number[] {
    if(degree(p) == 0) {
        return []
    } else if (degree(p) === 1) {
        const [b, a] = p
        // 0 = ax + b
        // x = -b/a
        return [-b/a]
    } else {
        const dpdx = derivative(p)
        const derivativeZeros = zeros(dpdx)
        return [
            ...betweenZeros(p, derivativeZeros),
            ...endZeros(p,derivativeZeros),
        ].sort()
    }
}

// the degree of the highest-degree term with non-zero coefficient
export function degree(p: Polynomial): number {
    let degree = 0
    for(let n = 0; n < p.length; n++) {
        if(p[n] !== 0) {
            degree = n
        }
    }
    return degree
}

// the derivative of the polynomial, as another polynomial
export function derivative(p: Polynomial): Polynomial {
    return p.map((coefficient, degree) => coefficient * degree).slice(1)
}

// Find zeros between derivative zeros of opposite sign and on derivative zeros
function betweenZeros(p: Polynomial, derivativeZeros: number[]): number[] {
    const zeros = []
    for(let i = 0; i < derivativeZeros.length - 1; i++) {
        const left = derivativeZeros[i]
        const right = derivativeZeros[i+1]
        const isSignChange = evalPolynomial(p, left) * evalPolynomial(p, right) < 0
        if (isZero(p, left)) {
            zeros.push(left)
        }
        if (isZero(p, right)) {
            zeros.push(right)
            // skip the next pair of zeros to avoid duplicates
            i++
        } 
        if (!isZero(p, left) && !isZero(p, right) && isSignChange) {
            // sign change, there is a zero in between
            zeros.push(findZeroBetween(p, left, right))
        }
    }
    return zeros
}

// find a zero of p between the two x values
// left doesn't actually have to be less than right
function findZeroBetween(p: Polynomial, left: number, right: number): number {
    // binary search
    if (evalPolynomial(p, left) * evalPolynomial(p, right) >= 0) {
        throw new Error("no sign change")
    }
    const middle = (left + right) / 2
    if (isZero(p, middle)) {
        return middle
    } else if (evalPolynomial(p, left) * evalPolynomial(p, middle) < 0) {
        // sign change between left and middle
        return findZeroBetween(p, left, middle)
    } else {
        // must be sign change between middle and right
        return findZeroBetween(p, middle, right)
    }
}

// Is it pretty much a zero?
function isZero(p: Polynomial, x: number): boolean {
    return Math.abs(evalPolynomial(p,x)) <= TOLERANCE
}

// evaluate p(x)
export function evalPolynomial(p: Polynomial, x: number): number {
    let answer = 0
    for(let n = 0; n <= degree(p); n++) {
        answer += p[n] * Math.pow(x, n)
    }
    return answer
}

// find zeros outside of the derivative zeros
function endZeros(p: Polynomial, derivativeZeros: number[]): number[] {
    if (derivativeZeros.length === 0) {
        return []
    } else {
        const zeros = []
        const minZero = derivativeZeros[0]
        const changeToLeft = evalPolynomial(p, minZero - 1) - evalPolynomial(p, minZero)
        const hasLeftZero = changeToLeft * evalPolynomial(p, minZero) < 0
        if (hasLeftZero) {
            zeros.push(findEndZero(p, minZero, -1))
        }
        const maxZero = derivativeZeros[derivativeZeros.length - 1]
        const changeToRight = evalPolynomial(p, maxZero + 1) - evalPolynomial(p, maxZero)
        const hasRightZero = changeToRight * evalPolynomial(p, maxZero) < 0
        if (hasRightZero) {
            zeros.push(findEndZero(p, maxZero, 1))
        }
        return zeros
    }
}

// find a zero beyond x in the given direction
function findEndZero(p: Polynomial, x: number, direction: number): number {
    const otherX = findSignChange(p, x, direction)
    return findZeroBetween(p, x, otherX)
}

// find an x-value in the given direction such that there is a sign change between x and that value
function findSignChange(p: Polynomial, x: number, direction: number): number {
    let step = direction
    let px = evalPolynomial(p, x)
    let otherX, isSignChange
    do {
        otherX = x + step
        isSignChange = px * evalPolynomial(p, otherX) < 0
        step *= 2
    } while (!isSignChange)
    return otherX
}