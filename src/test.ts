interface Left<A> {
    value: A;
    tag: 'left'
}

interface Right<B> {
    value: B;
    tag: 'right'
}

type Either<A, B> = Left<A> | Right<B>;

function isLeft<A>(val: any): val is Left<A> {
    if ((val as Left<A>).tag === 'left') return true;
    return false;
}

function isRight<B>(val: any): val is Right<B> {
    if ((val as Right<B>).tag === 'right') return true;
    return false;
}

function Left<A>(val: A): Left<A> {
    return { value: val, tag: 'left' };
}

function Right<B>(val: B): Right<B> {
    return { value: val, tag: 'right' };
}

function add(stringInput: string): Number {
    if (stringInput.length === 0) {
        return 0;
    } else {
        const delimiters = [",", "\n"]

        let equation = stringInput;
        if (stringInput.startsWith("//")) {
            const newDelimiter = stringInput.charAt(2);
            equation = stringInput.substr(4, stringInput.length - 4);
            delimiters.push(newDelimiter);
        }

        return splitByDelimiters([equation], delimiters)
            .map((splittedString: string) => parseInt(splittedString))
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
    }
}

function add2(stringInput: string): Either<Error, Number> {
    if (stringInput.length === 0) {
        return Right(0);
    } else {
        const delimiters = [",", "\n"]

        let equation = stringInput;
        if (stringInput.startsWith("//")) {
            const newDelimiter = stringInput.charAt(2);
            equation = stringInput.substr(4, stringInput.length - 4);
            delimiters.push(newDelimiter);
        }

        const numbers =
            splitByDelimiters([equation], delimiters)
                .map((splittedString: string) => parseInt(splittedString));
        
        if (numbers.some(number => number < 0)) {
            return Left(new Error("No negatives allowed"));
        }
        const sum = numbers.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
        return Right(sum);
    }
}

function splitByDelimiters(splittableNumberStrings: string[], delimiters: string[]): string[] {
    return delimiters
        .reduce((splittedNumberStrings: string[], currentDelimiter: string) => splitByDelimiter(splittedNumberStrings, currentDelimiter), splittableNumberStrings);
}

function splitByDelimiter(splittableNumberStrings: string[], delimiter: string): string[] {
    return splittableNumberStrings.flatMap((splittedString: string) => splittedString.split(delimiter));
}

test("Adds nothing; Returns 0", function () {
    const result = add("");
    expect(result).toBe(0);
});

test("Adds single number; Returns same number", function () {
    const result = add("1");
    expect(result).toBe(1);
});

test("Adds another single number; Returns same number", function () {
    const result = add("2");
    expect(result).toBe(2);
});

test("Adds two numbers; Returns sum", function () {
    const result = add("1,2");
    expect(result).toBe(3);
});

test("Adds three numbers; Returns sum", function () {
    const result = add("1,2,3,4,5");
    expect(result).toBe(15);
});

test("Handle newlines between numbers", function () {
    const result = add("1\n2,3");
    expect(result).toBe(6);
});

test("Support different delimiters", function () {
    const result = add("//;\n1;2");
    expect(result).toBe(3);
});

test("No negatives allowed", function () {
    const result = add2("//;\n1;-2");
    expect(isLeft(result)).toBeTruthy();
    expect((result.value as Error).message).toBe('No negatives allowed');
});