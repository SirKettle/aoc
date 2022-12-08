### Quick start

```
npm i
npm start
```

### Optional args

| Arg     | Description                                                            |
| ------- | ---------------------------------------------------------------------- |
| `test`  | Use test data stored in "./testInput" file of the relevent solution    |
| `day`   | `int` Only runs this day's solution                                    |
| `today` | Only runs today's solution                                             |
| `all`   | Runs the solutions for all years _- defaults to the current year only_ |

### Examples

```bash
# Just run the current day
npm start today

# Run the current day with test data
npm start today test

# Run the 8th day
npm start day=8

# Run all solutions for current year
npm start

# Run solutions for all years
npm start all
```
