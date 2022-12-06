### Quick start

```
npm i
npm start
```

### Optional args

| Arg     | Description                                                          |
| ------- | -------------------------------------------------------------------- |
| `test`  | Use test data stored in "./testInput" file of the relevent solution  |
| `today` | Just runs the solution for the current day                           |
| `all`   | Runs the solutions for all years - defaults to the current year only |

### Examples

```bash
# Just run the current day
npm start today

# Run the current day with test data
npm start today test

# Run all solutions for current year
npm start

# Run solutions for all years
npm start all
```
