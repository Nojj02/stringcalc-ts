function add(stringInput : string) : Number {
    if (stringInput.length === 0) {
        return 0;
    } else {
        const split = stringInput.split(',');
        let sum = 0;
        for (const value of split) {
            sum += parseInt(value);
        }

        return sum;
    }
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